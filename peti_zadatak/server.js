const fs = require('fs');
const http = require('http');
const url = require('url');
const querystring = require('query-string');
const PATH = "www/";

let artikli = [
    {
        'id': 1,
        'naziv': "Mleko",
        'cena': 120,
        'imeKompanije': "Imlek"
    },
    {
        'id': 2,
        'naziv': "Cips",
        'cena': 70,
        'imeKompanije': "Marbo"
    },
    {
        'id': 3,
        'naziv': "Cokolada",
        'cena': 120,
        'imeKompanije': "Marbo"
    }
];

http.createServer(function (req, res){    
    let urlObj = url.parse(req.url,true,false);
    if (req.method == "GET"){
        if (urlObj.pathname == "/"){ 
            fs.readFile(PATH + "index.html", function (err,data){
                if (err){
                    res.writeHead(404);
                    res.end(JSON.stringify(err));
                    return;
                }
                res.writeHead(200);
                res.end(data);
            });
        }
        if (urlObj.pathname == "/sve-artikli"){ 
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                res.end(sviArtikli(urlObj.query.imeKompanije));
            });
        }
    }
    else if(req.method == "POST") {
        if (urlObj.pathname == "/dodaj-artikal"){ 
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                res.end(dodajArtikal(querystring.parse(body).id,querystring.parse(body).naziv,querystring.parse(body).cena,
                querystring.parse(body).imeKompanije));
            });
        }
        if (urlObj.pathname == "/obrisi-artikal"){ 
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                res.end(obrisiArtikal(querystring.parse(body).id));
            });
        }
        if (urlObj.pathname == "/izmeni-artikal"){ 
            var body = '';
                req.on('data', function (data) {
                body += data;
            });
            req.on('end', function () {
                res.end(izmeniArtikal(querystring.parse(body).id,querystring.parse(body).naziv,querystring.parse(body).cena,
                querystring.parse(body).imeKompanije));
            });
        }
    }
}).listen(5000);

function sviArtikli(imeKopmanije){
    if (imeKopmanije == '' || artikli.find(x => x.imeKompanije == imeKopmanije) == undefined)
        return JSON.stringify(artikli);
    else {
        return JSON.stringify(artikli.filter(x => x.imeKompanije == imeKopmanije));
    }
}
function dodajArtikal(id,naziv,cena,imeKompanije){
    artikli.push({'id':parseInt(id),'naziv':naziv,'cena':parseInt(cena),'imeKompanije':imeKompanije});
    return JSON.stringify(artikli)
}
function obrisiArtikal(id){
    artikli = artikli.filter(x => x.id != id)
    return JSON.stringify(artikli)
}
function izmeniArtikal(id,naziv,cena,imeKompanije){
    artikli.find(x => x.id == id).naziv = naziv
    artikli.find(x => x.id == id).cena = cena
    artikli.find(x => x.id == id).imeKompanije = imeKompanije
    return JSON.stringify(artikli)
}