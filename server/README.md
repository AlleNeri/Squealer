# Squealer server
Il server viene implementato con pattern MVC. Il Model si interfaccia con il database. La View è l'interfaccia con l'esterno, un API. Il Controller sarà l'intermediario tra le due interfacce.

## Model
Il model è formato da un insieme di schemi creati tramite la libreria `mongoose` che permette la validazione e contemporaneamente il salvataggio nel database dei dati strutturati.

## Autenticazione
L'autenticazione degli utenti viene effettuata tramite Passport.js tramite la JWT strategy.
Per questa implementazion si necessita di creare una coppia di chiavi asimmetriche; per fare ciò esiste lo screept:
```bash
$ node dist/createKey.js
```
