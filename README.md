 Restaurant Reservation App - Backend

Αυτό είναι το backend μέρος της εφαρμογής **Κράτησης Τραπεζιών σε Εστιατόριο**, υλοποιημένο με **Node.js + Express** και σύνδεση σε **MariaDB**, στο πλαίσιο του μαθήματος **CN6035 – Mobile & Distributed Systems**.


 Τι κάνει το Backend

Το backend είναι υπεύθυνο για:
- Τη δημιουργία, είσοδο και έλεγχο χρηστών (authentication μέσω JWT).
- Την προβολή των διαθέσιμων εστιατορίων.
- Τη δημιουργία, επεξεργασία και διαγραφή κρατήσεων.
- Την επιστροφή των κρατήσεων ανά χρήστη.


 Τεχνολογίες

- Node.js
- Express.js
- MariaDB
- JSON Web Tokens (JWT)
- bcrypt για hashing κωδικών
- dotenv για περιβαλλοντικές μεταβλητές


 API Endpoints (ενδεικτικά)

| Μέθοδος | Endpoint               | Περιγραφή                                 |
|--------|------------------------|--------------------------------------------|
| POST   | /register              | Εγγραφή νέου χρήστη                       |
| POST   | /login                 | Σύνδεση χρήστη και επιστροφή JWT          |
| GET    | /restaurants           | Λίστα διαθέσιμων εστιατορίων              |
| POST   | /reservations          | Δημιουργία κράτησης                        |
| PUT    | /reservations/:id      | Ενημέρωση υπάρχουσας κράτησης              |
| DELETE | /reservations/:id      | Διαγραφή κράτησης                          |
| GET    | /user/reservations     | Επιστροφή κρατήσεων χρήστη (με token)      |


 Δομή Φακέλων

restaurant-reservation-backend/
│
├── routes/ # Ορισμός διαδρομών API
├── controllers/ # Επιχειρησιακή λογική
├── models/ # Σύνδεση με βάση δεδομένων
├── middleware/ # JWT & error handling
├── db.js # Σύνδεση με MariaDB
├── app.js # Entry point του server
└── .env # Περιβαλλοντικές μεταβλητές (π.χ. DB credentials)



 Οδηγίες Εκτέλεσης (Τοπικά)

 1. Κλωνοποίησε το repository:
```bash
git clone https://github.com/Petran1213/restaurant-reservation-backend.git
cd restaurant-reservation-backend
2. Εγκατάσταση dependencies:
bash
Αντιγραφή
Επεξεργασία
npm install
3. Δημιουργία αρχείου .env:
env
Αντιγραφή
Επεξεργασία
PORT=5000
DB_HOST=localhost
DB_USER=youruser
DB_PASSWORD=yourpass
DB_NAME=restaurant_app
JWT_SECRET=your_jwt_secret
4. Εκκίνηση server:
bash
Αντιγραφή
Επεξεργασία
node app.js

 Βάση Δεδομένων
Η εφαρμογή συνδέεται με βάση MariaDB και χρησιμοποιεί τους εξής πίνακες:

users:

user_id (PK), name, email, password (hashed)

restaurants:

restaurant_id (PK), name, location, description

reservations:

reservation_id (PK), user_id (FK), restaurant_id (FK), date, time, people_count

 Δημιουργός
Όνομα: Petran (Πέτρος Μπενέτος)

Μάθημα: CN6035 - Mobile & Distributed Systems
Άδεια
Αυτό το έργο δημιουργήθηκε για εκπαιδευτικούς σκοπούς.
