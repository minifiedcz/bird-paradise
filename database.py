# this is the database connection file
# this file is responsible for connecting to the database
# and functions that interface with the database
import sqlite3
DATABASE_FILE = "birds.db"

# QUERIES FOR DROPDOWN FILTER FOR THE "BIRDS" SECTION
def getBirdTilesInfoByName(order):
    '''`order` = "ASC or "DESC". Returns a list of dictionaries in order of bird names A-Z or Z-A with keys "bird_ID", "bird_name", "image_file_name", "image_alt_text" values Birds.bird_ID, Birds.name, Images.file_name, Images.alt_text respectively. Each list element contains the information for a singular bird.
    '''
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()
    valid_orders = ['ASC', 'DESC']
    if order not in valid_orders:
        conn.close()
        raise ValueError(f"Invalid order parameter: {order}. Must be 'ASC' or 'DESC'.")
    c.execute(f"""
        SELECT Birds.bird_ID, Birds.name, Images.file_name, Images.alt_text 
        FROM Birds 
        JOIN Images 
            ON Birds.image_ID = Images.image_ID 
        ORDER BY Birds.name {order}""")
    rows = c.fetchall()
    conn.close()
    dict_rows = [
        {
            "bird_ID": row[0],
            "bird_name": row[1],
            "image_file_name": row[2],
            "image_alt_text": row[3]
        }
        for row in rows
    ]
    return dict_rows

def getBirdTilesInfoBySize(order):
    '''`order` = "ASC or "DESC". Returns a list of dictionaries in order of bird sizes small->large or large->small with keys "bird_ID", "bird_name", "image_file_name", "image_alt_text" values Birds.bird_ID, Birds.name, Images.file_name, Images.alt_text respectively. Each list element contains the information for a singular bird.
    '''
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()
    valid_orders = ['ASC', 'DESC']
    if order not in valid_orders:
        conn.close()
        raise ValueError(f"Invalid order parameter: {order}. Must be 'ASC' or 'DESC'.")
    c.execute(f"""
        SELECT Birds.bird_ID, Birds.name, Images.file_name, Images.alt_text 
        FROM Birds 
        JOIN Images 
            ON Birds.image_ID = Images.image_ID 
        ORDER BY Birds.size {order}""")
    rows = c.fetchall()
    conn.close()
    dict_rows = [
        {
            "bird_ID": row[0],
            "bird_name": row[1],
            "image_file_name": row[2],
            "image_alt_text": row[3]
        }
        for row in rows
    ]
    return dict_rows

def getBirdTilesInfoFromFamily(family_ID):
    '''`family_ID` ranges 1-6 inclusive. Returns a list of dictionaries in order of bird names A-Z or Z-A with keys "bird_ID", "bird_name", "image_file_name", "image_alt_text" values Birds.bird_ID, Birds.name, Images.file_name, Images.alt_text respectively. Each list element contains the information for a singular bird.
    '''
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()
    c.execute("""
        SELECT Birds.bird_ID, Birds.name, Images.file_name, Images.alt_text 
        FROM Birds 
        JOIN Images 
        ON Birds.image_ID = Images.image_ID 
        WHERE Birds.family_ID = ? 
        ORDER BY Birds.name ASC""", (family_ID,))
    rows = c.fetchall()
    conn.close()
    dict_rows = [
        {
            "bird_ID": row[0],
            "bird_name": row[1],
            "image_file_name": row[2],
            "image_alt_text": row[3]
        }
        for row in rows
    ]
    return dict_rows

# QUERIES FOR DROPDOWN FILTER FOR THE "FAMILIES" SECTION
def getFamilyTilesInfoByName(order):
    '''`order` = "ASC or "DESC". Returns a list of dictionaries in order of family names A-Z or Z-A with keys "family_ID", "family_name", "image_file_name", "image_alt_text" values Families.family_ID, Families.name, Images.file_name, Images.alt_text respectively. Each list element contains the information for a single family.
    '''
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()
    valid_orders = ['ASC', 'DESC']
    if order not in valid_orders:
        conn.close()
        raise ValueError(f"Invalid order parameter: {order}. Must be 'ASC' or 'DESC'.")
    c.execute(f"""
        SELECT Families.family_ID, Families.name, Images.file_name, Images.alt_text
        FROM Families
        JOIN Images 
            ON Families.image_ID = Images.image_ID
        ORDER BY Families.name {order}""")
    rows = c.fetchall()
    conn.close()
    dict_rows = [
        {
            "family_ID": row[0],
            "family_name": row[1],
            "image_file_name": row[2],
            "image_alt_text": row[3]
        }
        for row in rows
    ]
    return dict_rows

# QUERIES FOR PROFILE PAGES
def getBirdInfo(bird_ID):
    '''
    `bird_ID` ranges from 1-12 inclusive. Returns a dictionary with keys "bird_ID", "bird_name", "bird_scientific_name", "family_ID", "family_name", "bird_size", "bird_description", "image_file_name", "image_alt_text", "image_caption" values Birds.bird_ID, Birds.name, Birds.scientific_name, Families.family_ID, Families.name, Birds.size, Birds.description, Images.file_name, Images.alt_text, Images.caption respectively.
    '''
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()
    c.execute("""
        SELECT Birds.bird_ID, Birds.name, Birds.scientific_name, Families.family_ID, Families.name, Birds.size, Birds.description, Images.file_name, Images.alt_text, Images.caption
        FROM Birds
            JOIN Families 
                ON Birds.family_ID = Families.family_ID
            JOIN Images 
                ON Birds.image_ID = Images.image_ID
        WHERE Birds.bird_ID = ?""", (bird_ID,))
    row = c.fetchone()
    conn.close()
    dict_row = {
        "bird_ID": row[0],
        "bird_name": row[1],
        "bird_scientific_name": row[2],
        "family_ID": row[3],
        "family_name": row[4],
        "bird_size": row[5],
        "bird_description": row[6],
        "image_file_name": row[7],
        "image_alt_text": row[8],
        "image_caption": row[9]
    }
    return dict_row

def getFamilyInfo(family_ID):
    '''`family_ID` ranges 1-6 inclusive. Returns a dictionary with keys "family_ID", "family_name", "birds_in_family" (*), "family_description", "image_file_name", "image_alt_text", "image_caption" values Families.family_ID, Families.name, (*), Families.description, Images.file_name, Images.alt_text, Images.caption respectively.

    (*) "birds_in_family" is a list of dictionaries [{"bird_ID": Birds.bird_ID, "bird_name": Birds.name}, etc.]
    '''
    conn = sqlite3.connect(DATABASE_FILE)
    c = conn.cursor()
    c.execute("""
        SELECT Families.family_ID, Families.name, Families.description, Images.file_name, Images.alt_text, Images.caption
        FROM Families
            JOIN Images 
                ON Families.image_ID = Images.image_ID
        WHERE Families.family_ID = ?""", (family_ID,))
    row = c.fetchone()

    c.execute("""
        SELECT bird_ID, name
        FROM Birds
        WHERE family_ID = ?""", (family_ID,))
    bird_rows = c.fetchall()
    conn.close()

    birds_in_family = [
        {"bird_ID": bird[0], "bird_name": bird[1]}
        for bird in bird_rows
    ]

    dict_row = {
        "family_ID": row[0],
        "family_name": row[1],
        "birds_in_family": birds_in_family,
        "family_description": row[2],
        "image_file_name": row[3],
        "image_alt_text": row[4],
        "image_caption": row[5]
    }
    return dict_row

# Testing purposes only
if __name__ == "__main__":
    a = getBirdInfo(1)
    print(a)
    print(len(a))