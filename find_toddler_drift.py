
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def find_toddler_drift(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    balance = 0
    in_toddler = False
    
    for i, line in enumerate(lines):
        line_num = i + 1
        d_o = len(re.findall(r'<div', line))
        d_c = len(re.findall(r'</div>', line))
        
        balance += d_o
        balance -= d_c
        
        if "{activeSection === 'toddler'" in line:
            in_toddler = True
            print(f"TODDLER START line {line_num}, balance={balance}")
            
        if in_toddler:
            if "{activeSection === 'stickers'" in line:
                print(f"TODDLER END detected by STICKERS start at line {line_num}, balance={balance}")
                in_toddler = False

find_toddler_drift(r'd:\OWN PROJECT\my-School--main\src\components\Student\JuniorActivityCenter.jsx')
