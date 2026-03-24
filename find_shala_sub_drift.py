
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def find_subgame_drift(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    balance = 0
    in_shala = False
    
    for i, line in enumerate(lines):
        line_num = i + 1
        d_o = 0
        for d in re.findall(r'<div[^>]*>', line):
            if not d.endswith('/>'):
                d_o += 1
        
        d_c = len(re.findall(r'</div>', line))
        balance += d_o
        balance -= d_c
        
        if "{activeSection === 'shala'" in line:
            in_shala = True
            
        if in_shala:
            # Check ends of all sub-games
            if ')}' in line and 'activeAcademicGame ===' in lines[max(0, i-50):i+1][-1]: # very rough
                # Let's just catch all )} lines in shala
                if balance != 3:
                    print(f"Drift inside SHALA at line {line_num}: balance is {balance}, expected 3")
                    # print line context
                    print(f"LINE: {line.strip()}")

find_subgame_drift(r'd:\OWN PROJECT\my-School--main\src\components\Student\JuniorActivityCenter.jsx')
