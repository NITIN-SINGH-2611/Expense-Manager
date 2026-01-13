"""
Expense Manager Backend Server
Stores expense data in a JSON file for cross-device synchronization
"""

import os
import json
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='.')
CORS(app)

# Database file - stores all expense data
DB_FILE = 'expense_data.json'

def ensure_db_file():
    """Ensure the database file exists"""
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump({'records': [], 'lastId': 0}, f, indent=2)
        print(f"Created database file: {DB_FILE}")

def load_database():
    """Load expense data from JSON file"""
    ensure_db_file()
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"Loaded database from {DB_FILE}")
            return data
    except Exception as e:
        print(f"Error loading database: {e}")
        return {'records': [], 'lastId': 0}

def save_database(data):
    """Save expense data to JSON file"""
    ensure_db_file()
    try:
        with open(DB_FILE, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Database saved to {DB_FILE}")
        return True
    except Exception as e:
        print(f"Error saving database: {e}")
        return False

@app.route('/')
def index():
    """Serve the main page"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    """Serve static files"""
    return send_from_directory('.', path)

@app.route('/api/get_expenses', methods=['GET'])
def get_expenses():
    """Get all expense records"""
    try:
        db = load_database()
        response = jsonify({
            'success': True,
            'records': db.get('records', []),
            'lastId': db.get('lastId', 0)
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        print(f"Error in get_expenses: {str(e)}")
        response = jsonify({'success': False, 'error': str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

@app.route('/api/add_expense', methods=['POST', 'OPTIONS'])
def add_expense():
    """Add a new expense record"""
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
    
    try:
        data = request.json
        if not data:
            return jsonify({'success': False, 'error': 'No data received'}), 400
        
        record_type = data.get('type', '').strip()
        amount = data.get('amount', 0)
        category = data.get('category', '').strip()
        description = data.get('description', '').strip()
        date = data.get('date', '').strip()
        
        if not record_type or not amount or amount <= 0 or not category or not date:
            return jsonify({'success': False, 'error': 'Invalid data'}), 400
        
        # Load database
        db = load_database()
        
        # Create new record
        new_id = db.get('lastId', 0) + 1
        record = {
            'id': new_id,
            'type': record_type,
            'amount': amount,
            'category': category,
            'description': description,
            'date': date,
            'timestamp': datetime.now().isoformat()
        }
        
        # Add to records
        if 'records' not in db:
            db['records'] = []
        db['records'].append(record)
        db['lastId'] = new_id
        
        # Save database
        if save_database(db):
            print(f"✅ Expense saved: {record_type} - ₹{amount} on {date}")
            response = jsonify({
                'success': True,
                'message': 'Expense added successfully',
                'record': record
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        else:
            return jsonify({'success': False, 'error': 'Failed to save'}), 500
            
    except Exception as e:
        print(f"Error in add_expense: {str(e)}")
        import traceback
        traceback.print_exc()
        response = jsonify({'success': False, 'error': str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

@app.route('/api/delete_expense/<int:expense_id>', methods=['DELETE', 'OPTIONS'])
def delete_expense(expense_id):
    """Delete an expense record"""
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'DELETE, OPTIONS')
        return response
    
    try:
        db = load_database()
        
        # Remove record
        initial_count = len(db.get('records', []))
        db['records'] = [r for r in db.get('records', []) if r.get('id') != expense_id]
        
        if len(db['records']) < initial_count:
            save_database(db)
            print(f"✅ Expense deleted: ID {expense_id}")
            response = jsonify({'success': True, 'message': 'Expense deleted successfully'})
        else:
            response = jsonify({'success': False, 'error': 'Expense not found'}), 404
        
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        print(f"Error in delete_expense: {str(e)}")
        response = jsonify({'success': False, 'error': str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

@app.route('/api/sync', methods=['POST', 'OPTIONS'])
def sync_expenses():
    """Sync expenses - merge local and server data"""
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
    
    try:
        data = request.json
        local_records = data.get('records', [])
        local_lastId = data.get('lastId', 0)
        
        # Load server database
        db = load_database()
        server_records = db.get('records', [])
        server_lastId = db.get('lastId', 0)
        
        # Merge records (avoid duplicates by ID)
        all_records = {}
        for record in server_records:
            all_records[record['id']] = record
        for record in local_records:
            all_records[record['id']] = record
        
        # Update database
        db['records'] = list(all_records.values())
        db['lastId'] = max(local_lastId, server_lastId, max([r['id'] for r in db['records']] + [0]))
        
        save_database(db)
        
        response = jsonify({
            'success': True,
            'records': db['records'],
            'lastId': db['lastId']
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        print(f"Error in sync_expenses: {str(e)}")
        response = jsonify({'success': False, 'error': str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response, 500

if __name__ == '__main__':
    print("=" * 60)
    print("Expense Manager Server")
    print("=" * 60)
    print(f"\nStarting server on http://localhost:5002")
    print("Open your browser and navigate to the URL above")
    print("\nPress Ctrl+C to stop the server")
    print("\nData will be stored in: expense_data.json")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=5002)
