# Retseptid - Retseptirakendus

## Ülevaade
Retseptid on veebirakendus, mis võimaldab kasutajatel lisada, vaadata ja salvestada oma lemmikretsepte. Kasutajad saavad erinevaid retsepte näha ja oma lemmikretsepte salvestada.

## Tehnoloogiad
Projekt kasutab järgmisi tehnoloogiaid:

- **Frontend:** React.js, React Bootstrap
- **Backend:** Node.js, Express.js, MySQL
- **Autentimine:** JWT (JSON Web Token)
- **Failihaldus:** Multer (piltide üleslaadimiseks)
- **Andmebaas:** MySQL koos tabelitega `kasutajad`, `retseptid`, `lemmikud`

## Paigaldamine

1. **Klooni repositoorium:**
   ```sh
   git clone https://github.com/SinuKasutajanimi/Retseptid.git
   cd Retseptid
   ```
2. **Installi sõltuvused:**
   - **Backend:**
     ```sh
     cd backend
     npm install
     ```
   - **Frontend:**
     ```sh
     cd ../frontend
     npm install
     ```
3. **Käivita rakendus**
   - **Backend:**
     ```sh
     cd backend
     node server.js
     ```
   - **Frontend:**
     ```sh
     cd frontend
     npm start
     ```

## Autentimine
- Kasutajad saavad registreeruda ja sisse logida.
- Pärast sisselogimist saavad kasutajad JWT-tokeni, mis salvestatakse `localStorage`-i.
- Tokenit kasutatakse API-päringute autentimiseks.

## Funktsionaalsus
- **Retseptide lisamine** - Kasutajad saavad lisada uusi retsepte koos pildiga.
- **Retseptide vaatamine** - Kõik retseptid on nähtavad avalikus vaates.
- **Lemmikretseptide haldamine** - Kasutajad saavad retsepte lemmikuks lisada ja sealt ka eemaldada.

## Andmebaasi struktuur (MySQL)
```sql
CREATE TABLE kasutajad (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL,
  kasutajanimi VARCHAR(150),
  password VARCHAR(150) NOT NULL
);

CREATE TABLE retseptid (
  ret_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  koostisosad TEXT,
  retsept TEXT NOT NULL,
  id INT UNSIGNED,
  FOREIGN KEY (id) REFERENCES kasutajad(id) ON DELETE CASCADE
);

CREATE TABLE lemmikud (
  ret_id INT NOT NULL,
  id INT NOT NULL,
  PRIMARY KEY (ret_id, id),
  FOREIGN KEY (ret_id) REFERENCES retseptid(ret_id) ON DELETE CASCADE,
  FOREIGN KEY (id) REFERENCES kasutajad(id) ON DELETE CASCADE
);
```

## API Endpointid

### Kasutajate autentimine:
- `POST /login` – Kasutaja sisselogimine
- `POST /sign-up` – Kasutaja registreerimine

### Retseptid:
- `POST /add-recipe` – Retsepti lisamine
- `GET /recipes` – Kõigi retseptide vaatamine

### Lemmikretseptid:
- `POST /favorites/add` – Retsepti lisamine lemmikutesse
- `POST /favorites/remove` – Retsepti eemaldamine lemmikutest
- `GET /favorites` – Kasutaja lemmikute vaatamine
