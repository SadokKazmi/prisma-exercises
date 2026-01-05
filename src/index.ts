// Start by installing the project with `npm install`
// Set your connection string in the `.env` file
// Set up your schema.prisma file
// Generate the client with `npx prisma generate`
// Update the database with with `npx prisma migrate dev`
// Run the app with `npm run start`

import { input, select } from "@inquirer/prompts";
import { PrismaClient } from "./generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import promptSync from "prompt-sync";
import type { create } from "domain";

const prompt = promptSync();

const connectionString = `${process.env.DATABASE_URL}`;
if (!connectionString) {
  throw new Error('Could not find "DATABASE_URL" in your .env file');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function displayPretty(str: string): string {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

async function addMoviesToDataBase() {
  const textTest1 = `
		('Cast Away','Drama','Robert Zemeckis','2000','150'),
		('Leon','Drama crime','Luc Besson','1994','150'),
		('Inception','Sci-Fi Epic','Christofer Nolan','2010','150'),
		('Interstellar','Sci-Fi Epic','Christofer Nolan','2014','179'),
		('Gangs of New York','Drama Epic','Martin Scorsese','2002','180'),
		('Taxi driver','Drama Crime','Martin Scorsese','1976','150'),
		('Shutter Island','Drama Mystery','Martin Scorsese','2010','150'),
		('Red cliff','Historical Epic','John Woo','2008','150'),
		('Face Off','Crime Action','John Woo','1997','150'),
		('Prometheus','Sci-Fi Epic','Ridley Scott','2012','150'),
		('The Martian','Sci-Fi Epic','Ridley Scott','2015','150'),
		('Star Wars','Sci-Fi Epic','George Lucas','1977','150'),
		('The Lord of the Rings','fantasy Epic','Peter Jackson','2001','130'),
		('The Shawshank Redemption','Drama','Frank Drabont','1994','200'),
		('The Godfather','Crime Drama','Francis Ford Coppola','1972','200'),
		('The Godfather II','Crime Drama','Francis Ford Coppola','1974','200'),
		('Schindler´s List','History Drama','Steven Spielberg','1993','200'),
		('Pulp Fiction','Crime Drama','Quentin Tarantino','1994','49'),
		('The Good,the Bad and the Ugly','Western Drama','Sergio Leone','1966','120'),
		('Forrest Gump','Romance Drama','Robert Zemeckis','1994','200'),
		('Fight Club','Crime Drama','David Fincher','1999','1700'),
		('The Matrix','Sci-Fi Action','Lana Wachowski Lilly Wachowski','1999','120'),
		('Seven','Drama Crime','David Fincher','1995','200'),
		('Saving Private Ryan','Drama War','Steven Spielberg','1998','200'),
		('The Green Mile','Drama Crime','Frank Darabont','1999','180'),
		('Life Is Beautiful','Drama Comedy romance','Robert Benigni','1997','100'),
		('The Pianist','Drama Music','Roman Polanski','2002','100'),
		('Gladiator','Drama Adventure','Ridley Scott','2000','99'),
		('The Dak Knight','Drama Crime','Christopher Nolan','2008','99'),
		('12 Angry Men','Drama Crime','Sidney Lumet','1957','100'),
		('The Hobbit:The Battle of Five Armies','Fantasy','Peter Jackson','2014','179'),
		('The Wolf of Wall Street','Comedy Crime','Martin Scorsesi','2013','119');
`;

  const result1 = textTest1
    .split(")")
    .map((g) => g.trim().toLowerCase())
    .map((str) => str.replace(/[\n\t\t(')]/g, ""))
    //   .map((str) => str.replace(/[,]/g, " "))
    .map((g) => g.trim());

  type MovieInput = {
    title: string;
    genre: string[];
    director: string;
    year: number;
  };

  const movies: MovieInput[] = [];

  for (const row of result1) {
    if (!row || row.trim() === ";" || row.trim() === "") continue;

    const cleanRow = row.startsWith(",") ? row.slice(1) : row;
    const parts = cleanRow.split(",");
    if (parts.length < 5) continue;

    const [mTitle, genreStr, mDirector, mYear] = parts;

    movies.push({
      title: (mTitle ?? "").trim(),
      genre: (genreStr ?? "").split(" ").map((g) => g.trim().toLowerCase()),
      director: (mDirector ?? "").trim(),
      year: Number(mYear ?? 0),
      // price: Number(mPrice ?? 0),
    });
  }
  console.log(movies);

  for (const movie of movies) {
    await prisma.movie.create({
      data: {
        movieTitle: movie.title,
        movieReleaseDate: movie.year,
        director: {
          connectOrCreate: {
            where: { movieDirector: movie.director },
            create: { movieDirector: movie.director },
          },
        },
        movieGenre: {
          connectOrCreate: movie.genre.map((g) => ({
            where: { genreTitle: g },
            create: { genreTitle: g },
          })),
        },
      },
    });
  }
}
/**================================================================================== */
async function addMovie(): Promise<void> {
  // Expected:
  // 1. Prompt the user for movie title, year.

  // 2. Use Prisma client to create a new movie with the provided details.
  // 3. Print the created movie details.
  //
  // Transactions and relationships (This we can add later on)
  //    Reference : https://www.prisma.io/docs/orm/prisma-client/queries/transactions
  // Expected:
  // 1.b Prompt the user for genre.
  // 2.b If the genre does not exist, create a new genre.
  // 3.b Ask the user if they want to want to add another genre to the movie.
  try {
    await addMoviesToDataBase();
  } catch (e) {}
  while (true) {
    const movieName: string = prompt("Enter the Movie name:  ").toLowerCase();
    const movieYear: number = new Date(
      prompt("Enter the Movie Release Year:  ")
    ).getFullYear();
    const movieDirector: string = prompt(
      "Enter the Movie Director:  "
    ).toLowerCase();

    if (!movieName || !movieDirector || isNaN(movieYear)) {
      console.log("Entry is not valid! try again?");
      if (prompt("Y/N ?:  ").toLowerCase() === "n") {
        break;
      } else {
        continue;
      }
    }

    const movieGenre: string = prompt("Enter the Movie Genre:  ").toLowerCase();
    const post2Tbl = await prisma.movie.create({
      data: {
        movieTitle: movieName,
        movieReleaseDate: movieYear,
        director: {
          connectOrCreate: {
            where: { movieDirector: movieDirector },
            create: { movieDirector: movieDirector },
          },
        },
        movieGenre: {
          connectOrCreate: [
            {
              where: { genreTitle: movieGenre },
              create: { genreTitle: movieGenre },
            },
          ],
        },
      },
    });
    console.log(post2Tbl);
    await moreMovieGenre();

    /*##########################################################*/
    async function moreMovieGenre() {
      const otherGenres = prompt(
        "Would you like to add more genre to movie? Y/N  "
      ).toLowerCase();
      if (otherGenres === "y") {
        const movieGenre: string = prompt(
          "Enter the Movie Genre:  "
        ).toLowerCase();
        const crntMovID = await prisma.movie.findUnique({
          where: {
            movieTitle: movieName,
          },
          select: { id: true },
        });
        if (crntMovID) {
          const addNewGenre = await prisma.movie.update({
            where: { id: crntMovID.id },
            data: {
              movieGenre: {
                connectOrCreate: {
                  where: { genreTitle: movieGenre },
                  create: { genreTitle: movieGenre },
                },
              },
            },
          });
        } //if current movie id
        else {
          console.log("movie is noot exist in database");
        }

        await moreMovieGenre();
      } //if user wants to add more genre
      else {
        //in case of no more genre break out function
        return;
      }
    }

    const otherMovie = prompt(
      "Would you like to continue? Y/N  "
    ).toLocaleLowerCase();
    if (otherMovie === "n") {
      break;
    }
  }
}
/**================================================================================== */
async function updateMovie(): Promise<void> {
  await updateAMovie();
  // Expected:
  // 1. Prompt the user for movie ID to update.
  // 2. Prompt the user for new movie title, year.
  // 3. Use Prisma client to update the movie with the provided ID with the new details.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#update
  // 4. Print the updated movie details.
  async function updateAMovie() {
    const otherGenres = prompt(
      "Would you like to update  movie? Y/N  "
    ).toLowerCase();
    if (otherGenres === "y") {
      await listMovies();
      const movieID: number = Number(prompt("Enter the Movie id:  "));
      const crntMov = await prisma.movie.findUnique({
        where: {
          id: movieID,
        },
      });
      if (crntMov) {
        const updateMovieName: string = prompt(
          "Enter the Movie Name:  "
        ).toLowerCase();
        const movieRelease: number = Number(prompt("Enter the Movie Year:  "));
        const addNewUpdate = await prisma.movie.updateManyAndReturn({
          where: { id: movieID },
          data: {
            movieTitle: updateMovieName,
            movieReleaseDate: movieRelease,
          },
        });
        console.log(addNewUpdate);
      } //if current movie id
      else {
        console.log("Movie is not exist ib database");
      }
    } //if user wants to update
    else {
      //in case of no more genre break out function
      console.log("Always at service!");
      return;
    }
  }
}

/**================================================================================== */
async function deleteMovie(): Promise<void> {
  // Expected:
  // 1. Prompt the user for movie ID to delete.
  const removeMovie: number = Number(prompt("Enter movie ID to remove :  "));
  // 2. Use Prisma client to delete the movie with the provided ID.
  const movieRemoved = await prisma.movie.delete({
    where: { id: removeMovie },
  });
  console.log(movieRemoved);
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#delete
  // 3. Print a message confirming the movie deletion.
}
/**================================================================================== */
async function listMovies(): Promise<void> {
  // Expected:
  // 1. Use Prisma client to fetch all movies.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
  // 2. Include the genre details in the fetched movies.
  // 3. Print the list of movies with their genres (take 10).
  // console.dir(moviesList, { depth: null });

  const moviesList = await prisma.movie.findMany({
    include: {
      movieGenre: true,
      director: true,
    },
  });

  moviesList.forEach((movie) => {
    console.log("#:", movie.id);
    console.log("🎬 Movie:", displayPretty(movie.movieTitle));
    console.log(
      "🎭 Genres:",
      movie.movieGenre.map((g) => displayPretty(g.genreTitle)).join(", ")
    );
    console.log("🎥 Director:", displayPretty(movie.director.movieDirector));
    console.log("📅 Year:", movie.movieReleaseDate);
    console.log("---------------");
  });
}
/**================================================================================== */
async function listMovieById(): Promise<void> {
  // Expected:
  // 1. Prompt the user for movie ID to list.
  // 2. Use Prisma client to fetch the movie with the provided ID.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findunique
  // 3. Include the genre details in the fetched movie.
  // 4. Print the movie details with its genre.
  const movieID: number = Number(prompt("Enter movie ID to List :  "));

  const moviesList = await prisma.movie.findUnique({
    where: {
      id: movieID,
    },
    include: {
      movieGenre: true,
      director: true,
    },
  });

  if (!moviesList) {
    console.log("moviesList");
    return;
  }
  // console.log(moviesList);
  //in case of one output
  console.log("#:", moviesList.id);
  console.log("🎬 Movie:", displayPretty(moviesList.movieTitle));
  console.log(
    "🎭 Genres:",
    moviesList.movieGenre.map((g) => displayPretty(g.genreTitle)).join(", ")
  );
  console.log("🎥 Director:", displayPretty(moviesList.director.movieDirector));
  console.log("📅 Year:", moviesList.movieReleaseDate);
  console.log("---------------");
}

/**================================================================================== */
async function listMovieByGenre(): Promise<void> {
  // Expected:
  // 1. Prompt the user for genre Name to list movies.
  // 2. Use Prisma client to fetch movies with the provided genre ID.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany
  // 3. Include the genre details in the fetched movies.
  // 4. Print the list of movies with the provided genre (take 10).
  const movieGenreList: string = prompt(
    "Which kind of movie genre are you looking for :  "
  ).toLowerCase();

  const moviesByGenre = await prisma.movie.findMany({
    where: {
      movieGenre: {
        some: {
          genreTitle: { contains: movieGenreList, mode: "insensitive" },
        },
      },
    },

    include: {
      movieGenre: true,
      director: true,
    },
  });

  // console.dir(moviesByGenre, { depth: null });

  moviesByGenre.forEach((movie) => {
    console.log("#:", movie.id);
    console.log("🎬 Movie:", displayPretty(movie.movieTitle));
    console.log(
      "🎭 Genres:",
      movie.movieGenre.map((g) => displayPretty(g.genreTitle)).join(", ")
    );
    console.log("🎥 Director:", displayPretty(movie.director.movieDirector));
    console.log("📅 Year:", movie.movieReleaseDate);
    console.log("---------------");
  });
}
/**============================================================================================================================ */
async function addGenre(): Promise<void> {
  // Expected:
  // 1. Prompt the user for genre name.
  // 2. Use Prisma client to create a new genre with the provided name.
  //    Reference: https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create
  // 3. Print the created genre details.

  const addMovieGenre: string = prompt(
    "Which kind of movie genre are you adding :  "
  ).toLowerCase();

  const post2Tbl = await prisma.genre.upsert({
    where: {
      genreTitle: addMovieGenre,
    },
    update: {},
    create: {
      genreTitle: addMovieGenre,
    },
  });

  console.log(post2Tbl);
}

/**================================================================================== */

async function exitProgram(): Promise<never> {
  await prisma.$disconnect();
  process.exit(0);
}

const choices = [
  { name: "Add movie", value: addMovie },
  { name: "Update movie", value: updateMovie },
  { name: "Delete movie", value: deleteMovie },
  { name: "List all movies", value: listMovies },
  { name: "Get movie by ID", value: listMovieById },
  { name: "Get movies by Genre", value: listMovieByGenre },
  { name: "Add genre", value: addGenre },
  { name: "Exit", value: exitProgram },
] as const;

while (true) {
  try {
    console.clear();

    const action = await select({
      message: "Select an action:",
      choices: choices,
      loop: false,
    });

    await action();
  } catch (error) {
    console.error("An error occurred:", error);
    console.log("Please try again.");
  } finally {
    console.log();
    void (await input({
      message: "Press Enter to continue...",
      theme: {
        prefix: "",
      },
    }));
  }
}
