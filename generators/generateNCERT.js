import fs from "fs";
import path from "path";

const books = [

  {
    id: "ncert-8-science-ch5",
    board: "NCERT",
    class: 8,
    subject: "Science",
    chapter: 5,
    title: "Coal and Petroleum",
    language: "English",
    pdf: "https://ncert.nic.in/textbook.php?hesc1=0-13",
    keywords: [
      "coal",
      "petroleum",
      "fossil fuels",
      "science chapter 5"
    ]
  },

  {
    id: "ncert-8-maths-ch1",
    board: "NCERT",
    class: 8,
    subject: "Mathematics",
    chapter: 1,
    title: "Rational Numbers",
    language: "English",
    pdf: "https://ncert.nic.in/textbook.php?hemh1=0-16",
    keywords: [
      "rational numbers"
    ]
  }

];

const output = path.join("data","ncert","books.json");

fs.writeFileSync(
    output,
    JSON.stringify(books,null,2),
    "utf8"
);

console.log("✅ NCERT Database Generated Successfully");
console.log("Total Books :", books.length);