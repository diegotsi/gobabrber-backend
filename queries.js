mongoexport --db moleza_dev --collection users --type=csv --fields name,email,phone -q '{roles: 2}'  --out users.csv

db.getCollection('users').update({roles: 1, occupation: null},{$set: {roles:  NumberInt(2)}})
