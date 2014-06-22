from flask import render_template, _app_ctx_stack, jsonify
from app import app, host, port, user, passwd, db
from app.helpers.database import con_db
from sklearn.linear_model import LogisticRegression
import numpy as np
#import pandas.io.sql as psql
#import pandas as pd
#import matplotlib.pyplot as plt
#import MySQLdb
import pymysql
import sys
import simplejson
import pickle

# To create a database connection, add the following
# within your view functions:
# con = con_db(host, port, user, passwd, db)

#from app.helpers.database import con_db, query_db
#from app.helpers.filters import format_currency
import jinja2
 
def get_db():
	print "Getting DB"
	top = _app_ctx_stack.top
	if not hasattr(top, 'home_kitchen_db'):
		top.home_kitchen_db = pymysql.connect(host="localhost", user="root", db = "semfundc_zidisha")
	return top.home_kitchen_db

def query_db(query):
	sys.stderr.write("Querying Database with: " + query)
	cursor = get_db().cursor()
	cursor.execute(query)
	return cursor.fetchall()

def running_average(data):
	result = []
	index = 0
	total = 0
	for x in data:
		index += 1
		total += x[1]
		result.append([x[0], total/index])
	return result	

@app.route('/')
def index():
	return render_template('index.html')

@app.route('/product/json/<product_id>')
def product_details(product_id):
    query = "select finalrate, interest, sift_score, length(borrowers.tr_about) as tr_about from loanapplic join borrowers on loanapplic.borrowerid = borrowers.userid where loanid =  \" " + product_id +'";'
    data = query_db(query)
    data = np.array(data)
    
    query2 = "select borrowerid, interest, sift_score, length(borrowers.tr_about) as tr_about from loanapplic join borrowers on loanapplic.borrowerid = borrowers.userid where loanid =  \" " + product_id +'";'
    data2 = query_db(query2)
    data2 = np.array(data2)
    
    clf = pickle.load(open("app/model.p", "rb"))
    
    y = clf.predict(data)[0]
    y_p = clf.predict_proba(data)[0][0]
    
    if y == 1:
        recommendation = 'Approve loan'
        prediction = 'Likely to default'
    else:
        recommendation = 'Do not approve loan'
        prediction = 'Will default'
    
    print recommendation
    formatted_data = {'finalrate': data[0][0], 'interest': data[0][1], 'sift_score': data[0][2], 'tr_about': data[0][3], 'recommendation': recommendation, 'prediction': prediction, 'probability': y_p}
    
    # Now do stuff with the data ()
    return jsonify(formatted_data)
    

@app.route('/author')
def contact():
    # Renders author.html.
    return render_template('author.html')

@app.route('/dashboard')
def dashboard():
    # Renders author.html.
    return render_template('rich_info.htm')


@app.route('/slides')
def about():
    # Renders slides.html.
    return render_template('slides.html')


	


