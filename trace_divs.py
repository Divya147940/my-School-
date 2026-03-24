
import re
import sys

# Set output encoding to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

def find_imbalance(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    balance = 0
    for i, line in enumerate(lines):
        d_o = len(re.findall(r'<div', line))
        d_c = len(re.findall(r'</div>', line))
        balance += d_o
        balance -= d_c
        
        # Sections
        print(f"{i+1:4}: {balance:2} | {line.strip()[:60]}")
        
    print(f"Final div balance: {balance}")

find_imbalance(r'd:\OWN PROJECT\my-School--main\src\components\Student\JuniorActivityCenter.jsx')
