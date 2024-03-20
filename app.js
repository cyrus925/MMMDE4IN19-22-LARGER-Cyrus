const express = require('express')
const app = express()
const port = 3000
const path = require("path");
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "./views/home.html"))
})


app.get('/students', (req, res) => {
  const rowSeparator = "\n";
  const cellSeparator = ";";
  fs.readFile(
    "data.csv",
    "utf8",
    (err, data) => {
      const rows = data.split(rowSeparator);
      const [headerRow, ...contentRows] = rows;
      const header = headerRow.split(cellSeparator);
      const students = contentRows.map(row => {
        const cells = row.split(cellSeparator);
        const student = {
          name: cells[0],
          school: cells[1]
        };
        return student;
      });
      res.render("students", { students: students });
    });
  });


app.get('/students/create', (req,res)=>{
  res.render("create-student")
})

app.use(express.urlencoded({ extended: true }));
app.post('/students/create', (req,res)=>{
  console.log(req.body);
  const csvLine = `\r\n${req.body.name};${req.body.school}`
  console.log('csvLine', csvLine);
  const stream = fs.writeFile('data.csv', csvLine, { flag: "a" }, (err) => {
    res.redirect("/students/create?created=1");
  })
})

app.get('/api/students', (req, res) => {
  res.send([{ name: "Eric Burel", school: "EPF" }, { name: "HarryPotter", school: "Poudlard" }])
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const fs = require("fs")
app.get('/api/students-csv', (req, res) => {
  fs.readFile('data.csv', 'utf8', (err, data) => {
    if (err) {
      console.error('Une erreur s\'est produite lors de la lecture du fichier :', err);
      return;
    }
    res.send(data)
  });
})


app.get('/api/students-csv-parsed', (req, res) => {
  const rowSeparator = "\n";
  const cellSeparator = ";";
  fs.readFile(
    "data.csv",
    "utf8",
    (err, data) => {
      const rows = data.split(rowSeparator);
      const [headerRow, ...contentRows] = rows;
      const header = headerRow.split(cellSeparator);
      const students = contentRows.map(row => {
        const cells = row.split(cellSeparator);
        const student = {
          name: cells[0],
          school: cells[1]
        };
        return student;
      });
      console.log(students);
    });
});


app.use(express.json())
app.post('/api/students/create', (req, res) => {
  console.log(req.body)
  const csvLine = `\r\n${req.body.name};${req.body.school}`
  console.log('csvLine', csvLine);
  const stream = fs.writeFile('data.csv', csvLine, { flag: "a" }, (err) => {
    res.send('ok');
  })
})



