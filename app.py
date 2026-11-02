from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import random
import string

app = Flask(__name__)

# Configure SQLite Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- TABLE 1: Login Information ---
class LoginInfo(db.Model):
    __tablename__ = 'login_info'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    userrole = db.Column(db.String(50), nullable=False, default='Student')
    status = db.Column(db.String(50), nullable=False, default='Active')

# --- TABLE 2: Biodata Information ---
class BiodataInfo(db.Model):
    __tablename__ = 'biodata_info'
    matric = db.Column(db.String(50), primary_key=True)
    fullname = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    gender = db.Column(db.String(20), nullable=False)
    dob = db.Column(db.String(20), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    level = db.Column(db.String(20), nullable=False)

# Initialize database tables
with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/submit', methods=['POST'])
def submit_biodata():
    data = request.get_json()

    # Server-Side Duplicate Check
    existing_student = BiodataInfo.query.get(data.get('matric'))
    if existing_student:
        return jsonify({'error': 'A record with this Matric Number already exists.'}), 400

    # Auto-generate login credentials
    generated_username = (data['firstname'][0] + data['surname']).lower() + str(random.randint(10, 99))
    generated_password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))

    # Insert into Table 1 (login_info)
    new_login = LoginInfo(
        username=generated_username,
        password=generated_password,
        userrole='Student',
        status='Active'
    )
    db.session.add(new_login)

    # Insert into Table 2 (biodata_info)
    new_biodata = BiodataInfo(
        matric=data['matric'],
        fullname=f"{data['surname']} {data['firstname']} {data['middlename']}",
        email=data['email'],
        gender=data['gender'],
        dob=data['dob'],
        department=data['department'],
        level=data['level']
    )
    db.session.add(new_biodata)

    db.session.commit()
    return jsonify({'message': 'Biodata saved to SQLite database successfully!'}), 201

@app.route('/api/records', methods=['GET'])
def get_records():
    logins = LoginInfo.query.all()
    biodatas = BiodataInfo.query.all()

    login_list = [{
        'id': l.id,
        'username': l.username,
        'password': l.password,
        'userrole': l.userrole,
        'status': l.status
    } for l in logins]

    biodata_list = [{
        'matric': b.matric,
        'fullname': b.fullname,
        'email': b.email,
        'gender': b.gender,
        'dob': b.dob,
        'department': b.department,
        'level': b.level
    } for b in biodatas]

    return jsonify({'logins': login_list, 'biodatas': biodata_list})

if __name__ == '__main__':
    app.run(debug=True)