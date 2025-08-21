
import re

def create_js_object(name, kml_path, data_text):
    """
    Parses a block of text to extract hike stage details and formats it
    into a JavaScript object string.

    Args:
        name (str): The name of the hike stage (e.g., "Stage 4: Lake Crossing").
        kml_path (str): The relative path to the KML file (e.g., "kml/day4.kml").
        data_text (str): The multi-line string containing the stage data.

    Returns:
        str: A formatted string representing the JavaScript object.
    """
    
    # --- Data Extraction using Regular Expressions ---
    
    def extract_value(pattern, text):
        match = re.search(pattern, text, re.M)
        return match.group(1).strip() if match else ''
        
    def extract_multiline_value(label, text):
        """Extracts multi-line values that follow a specific label."""
        # This pattern finds the label and captures all subsequent lines
        # until it hits a blank line or the end of the string.
        pattern = re.compile(rf"^{label}:\n([\s\S]*?)(?=\n\n|\Z)", re.M)
        match = pattern.search(text)
        if not match:
            return ''
        
        # Clean up the captured lines
        lines = match.group(1).strip().split('\n')
        # Join the cleaned lines into a single string
        return ', '.join(line.strip() for line in lines)


    distance = extract_value(r"^Distance:\s*(.+)", data_text)
    time = extract_value(r"^Approximate walking time:\s*(.+)", data_text)
    ascent = extract_value(r"^Ascent:\s*(.+)", data_text)
    descent = extract_value(r"^Descent:\s*(.+)", data_text)
    difficulty = extract_value(r"^Difficulty:\s*(.+)", data_text)
    ground_type = extract_multiline_value("Type of ground", data_text) # New field

    # --- Formatting the JavaScript Object String ---
    
    js_object_string = f"""
    {{ 
        name: '{name}', 
        kml: '{kml_path}', 
        distance: '{distance}',
        time: '{time}',
        ascent: '{ascent}',
        descent: '{descent}',
        difficulty: '{difficulty}',
        groundType: '{ground_type}'
    }},"""
    
    # Remove leading indentation from the multi-line string
    return '\n'.join(line.lstrip() for line in js_object_string.strip().split('\n'))



# 1. Provide the name and KML path for the new stage.
stage_name = "Alternative day 4:  No via ferrata"
kml_file_path = "aaaaa"

# 2. Paste the data copied from the website here.
input_text = """
Distance:
16,56 km
Approximate walking time:
8 h
Approximate walking time back:
8 h
Ascent:
1.343 m
Descent:
1.442 m
Difficulty:
Easy
Type:
Mountain trail 96 %
Unmarked 4 %
Type of ground:
Path 88 %
Bad path 1 %
Forestry road 11 %
"""

# 3. Generate the JavaScript object.
js_output = create_js_object(stage_name, kml_file_path, input_text)

# 4. Print the result. You can copy this output and paste it into your data.js file.
print(js_output)

