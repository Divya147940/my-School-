
import re

def find_div_imbalance(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.splitlines()
    balance = 0
    section_stack = []
    
    for i, line in enumerate(lines):
        line_num = i + 1
        
        # Track section opens
        if '{activeSection ===' in line:
            m = re.search(r"activeSection === '([^']+)'", line)
            if m:
                section_stack.append(m.group(1))
                # print(f"ENTERING {m.group(1)} at line {line_num}")
                
        # Track div balance RELATIVE to section
        d_o = len(re.findall(r'<div', line))
        d_c = len(re.findall(r'</div>', line))
        
        balance += d_o
        balance -= d_c
        
        # Sections should end with )}
        if ')}' in line and section_stack:
            # When a section ends, balance should be what it was before entering
            # Actually, each section has a <div> inside it.
            # So balance usually increases by 1 for the section div.
            # And should decrease by 1 when section ends.
            # print(f"LEAVING {section_stack.pop()} at line {line_num}, current balance={balance}")
            section_stack.pop()

        if balance < 0:
            print(f"ERROR: Negative div balance at line {line_num}")
            break
            
    print(f"Final div balance: {balance}")

find_div_imbalance(r'd:\OWN PROJECT\my-School--main\src\components\Student\JuniorActivityCenter.jsx')
