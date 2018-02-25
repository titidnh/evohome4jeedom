# Script to read the zones available in the device 0

# Load required libraries
import sys
import requests
import json
from evohomeclient2 import EvohomeClient

# Ser login details in the 2 fields below
USERNAME = sys.argv[1]
PASSWORD = sys.argv[2]
LOCATION_ID = sys.argv[3]

client = EvohomeClient(USERNAME, PASSWORD, False)

accurateDevices = None
ACCURATE_MODE = True
#Initial JSON POST to the website to return your userdata
baseurl = 'https://tccna.honeywell.com/WebAPI/api/'
postData = {'Username':USERNAME, 'Password':PASSWORD, 'ApplicationId':'91db1612-73fd-4500-91b2-e63b069b185c'}
lHeaders = {'content-type':'application/json'}
response = requests.post(baseurl + 'Session',data=json.dumps(postData),headers=lHeaders)
userInfos = json.loads(response.content)
#Next, using your userid, get all the data back about your site
#Print out the headers for our temperatures, this let's us input to .csv file easier for charts
url = baseurl + 'locations?userId=%s&allData=True' % userInfos['userInfo']['userID']
lHeaders['sessionId'] = userInfos['sessionId']
response = requests.get(url,data=json.dumps(postData),headers=lHeaders)
locations = json.loads(response.content)
if LOCATION_ID == '-1':
	accurateDevices = locations[0]['devices']
else:
	for location in locations:
		if str(location['locationID']) == LOCATION_ID:
			accurateDevices = location['devices']
if accurateDevices == None:
	ACCURATE_MODE = False

loc = None
if LOCATION_ID == '-1':
	loc = client.locations[0]
else:
	for tmp in client.locations:
		if tmp.locationId == LOCATION_ID:
			loc = tmp
if loc == None:
	print '{ "success" : false, "error" : "no location for ID = ' + LOCATION_ID + '"}'
else:
	tcs = loc._gateways[0]._control_systems[0]

	jZones = '{ "success" : true'
	# examples : Auto (isPermanent=True) / 
	jZones = jZones + ', "currentMode":"' + tcs.systemModeStatus['mode'] + '"'
	jZones = jZones + ', "permanentMode" : '
	if tcs.systemModeStatus['isPermanent']:
		jZones = jZones + 'true'
	else:
		jZones = jZones + 'false'
	if tcs.systemModeStatus['isPermanent']:
		jZones = jZones + ', "untilMode" : "NA"'
	else:
		jZones = jZones + ', "untilMode" : "' + tcs.systemModeStatus['timeUntil'] + '"'

	jZones = jZones + ', "zones" : ['
	nb = 0
	nbItems = len(tcs._zones)
	for zone in tcs._zones:
		jZones = jZones + '{ "id" : ' + zone.zoneId
		jZones = jZones + ', "name" : "' + zone.name + '"'
		if zone.temperatureStatus['isAvailable'] == False:
			jZones = jZones + ', "temperature" : null'
			jZones = jZones + ', "temperatureD5" : null'
		elif ACCURATE_MODE:
			for device in accurateDevices:
				if str(device['deviceID']) == zone.zoneId:
					jZones = jZones + ', "temperature" : ' + str(device['thermostat']['indoorTemperature'])
					jZones = jZones + ', "temperatureD5" : ' + str(zone.temperatureStatus['temperature'])
		else:
			jZones = jZones + ', "temperature" : ' + str(zone.temperatureStatus['temperature'])
		jZones = jZones + ', "setPoint" : ' + str(zone.heatSetpointStatus['targetTemperature'])
		# example 'FollowSchedule' / PermanentOverride (manual or permanent) / TemporaryOverride+nextTime (until xx)
		jZones = jZones + ', "status" : "' + zone.heatSetpointStatus['setpointMode'] + '"'
		if zone.heatSetpointStatus['setpointMode'] == 'TemporaryOverride':
			# example : 2018-01-25T08:00:00
			jZones = jZones + ', "until" : "' + zone.heatSetpointStatus['until'] + '"'
		else:
			jZones = jZones + ', "until" : "NA"'
		# add schedule infos (NB : each call to zone.schedule() takes ~1 sec because of an API request)
		jZones = jZones + ', "schedule":' + json.dumps(zone.schedule())
		jZones = jZones + "}"
		# {'id' : 1567715, 'name' : 'Sejour', 'temperature' : 20.0, 'setPoint' : 17.0, 'status' : 'FollowSchedule'}
		nb = nb + 1
		if nb < nbItems:
			jZones = jZones + ','

	jZones = jZones + ']}'
	# 2018-02-21 - thx to ecc - fix to correctly send some non ascii characters (specifically inside the names of the zones)
	print jZones.encode('utf-8')
