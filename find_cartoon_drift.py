
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def find_cartoon_drift(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    balance = 0
    in_cartoon = False
    
    for i, line in enumerate(lines):
        line_num = i + 1
        d_o = len(re.findall(r'<div', line))
        d_c = len(re.findall(r'</div>', line))
        
        balance += d_o
        balance -= d_c
        
        if "{activeSection === 'cartoon'" in line:
            in_cartoon = True
            print(f"CARTOON START line {line_num}, balance={balance}")
            
        if in_cartoon:
            if "{activeSection === 'toddler'" in line:
                print(f"CARTOON END detected by TODDLER start at line {line_num}, balance={balance}")
                in_cartoon = False

find_cartoon_drift(r'd:\OWN PROJECT\my-School--main\src\components\Student\JuniorActivityCenter.jsx')
