# this is the main web application file
# this file is responsible for handling the web requests and responses

from flask import Flask, render_template, request, jsonify
import database as db
app = Flask(__name__)

# PAGES
# main page
@app.route("/", methods=["GET"])
def index():
    birdsTileInfo = db.getBirdTilesInfoByName("ASC")
    familiesTileInfo = db.getFamilyTilesInfoByName("ASC")
    return render_template("index.html", birdsTileInfo=birdsTileInfo, familiesTileInfo=familiesTileInfo)

@app.route("/moreInfo/birds", methods=["GET"])
def moreInfoBirds():
    bird_ID = request.args.get('bird-ID')
    birdInfo = db.getBirdInfo(bird_ID)
    return render_template("moreInfoBirds.html", birdInfo=birdInfo)

@app.route("/moreInfo/families", methods=["GET"])
def moreInfoFamilies():
    family_ID = request.args.get('family-ID')
    familyInfo = db.getFamilyInfo(family_ID)
    return render_template("moreInfoFamilies.html", familyInfo=familyInfo)

# FILTERS
# Filtering birds
@app.route("/filter/birds", methods=["GET"])
def filter_birds():
    # Expected query parameters:
    # filterType = 'name' or 'size' or 'family'
    # filterValue = 'asc'/'desc' for name and size, family_ID for family
    filterType = request.args.get('filterType')
    filterValue = request.args.get('filterValue')
    
    if filterType == 'name':
        order = 'ASC' if filterValue == 'asc' else 'DESC'
        data = db.getBirdTilesInfoByName(order)
    elif filterType == 'size':
        order = 'ASC' if filterValue == 'asc' else 'DESC'
        data = db.getBirdTilesInfoBySize(order)
    elif filterType == 'family':
        familyID = int(filterValue)
        data = db.getBirdTilesInfoFromFamily(familyID)
    else:
        # If no filter was given, default to name ascending
        # This shouldn't happen, but it's here just in case
        # e.g. user refreshes the filter page, so it wasn't properly called from the index page
        data = db.getBirdTilesInfoByName("ASC")

    return jsonify(data)

# Filtering families
@app.route("/filter/families", methods=["GET"])
def filter_families():
    # Only one filter: name asc or desc
    filterValue = request.args.get('filterValue', 'asc')
    order = 'ASC' if filterValue == 'asc' else 'DESC'
    data = db.getFamilyTilesInfoByName(order)
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True, port=5000)