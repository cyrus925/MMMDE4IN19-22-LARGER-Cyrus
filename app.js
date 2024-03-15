const express = require('express')
const app = express()
const port = 3000
const path = require("path");
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"./views/home.html"))
})


app.get('/students', (req, res) => {
  
    const rowSeparator = '\r\n';
    const cellSeparator = ';';
    fs.readFile('data.csv', 'utf8', (err, data) => {
  
      const rows = data.split(rowSeparator);
      console.log("rows",rows);
      const [headerRow, ...contentRows] = rows
      const header = headerRow.split(cellSeparator);
      console.log("header",header);
      const students = contentRows.map((row) => {
        const cells = row.split(cellSeparator);
        const student = {
          [header[0]]: cells[0],
          [header[1]]: cells[1],
          // Ajoutez ici les autres colonnes du fichier CSV si nécessaire
        };
        console.log("student name",student.name);
        return student;
      });
  
      console.log('students',students);
      res.render("students", { students: students });
    });
  });


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



app.use(express.json())
app.post('/api/students/create', (req, res) => {
  console.log(req.body)
  const csvLine =`\n${req.body.name};${req.body.school}` 
  console.log('csvLine', csvLine);
   const stream=fs.writeFile('data.csv', csvLine, { flag: "a" }, (err) => {
    res.send('ok');
  }) 
  res.send("Student created")
})



