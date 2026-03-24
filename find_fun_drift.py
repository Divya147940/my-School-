
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def find_fun_drift(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    balance = 0
    in_fun = False
    
    for i, line in enumerate(lines):
        line_num = i + 1
        d_o = len(re.findall(r'<div', line))
        d_c = len(re.findall(r'</div>', line))
        
        balance += d_o
        balance -= d_c
        
        if "{activeSection === 'fun'" in line:
            in_fun = True
            print(f"FUN START line {line_num}, balance={balance}")
            
        if in_fun:
            if "{activeSection === 'magic'" in line:
                print(f"FUN END detected by MAGIC start at line {line_num}, balance={balance}")
                in_fun = False

find_fun_drift(r'd:\OWN PROJECT\my-School--main\src\components\Student\JuniorActivityCenter.jsx')
