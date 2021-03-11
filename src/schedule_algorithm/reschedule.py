from ortools.sat.python import cp_model
import numpy as np
import pandas as pd
import sys
from reschedule_func import reschedule_func

current_request = sys.argv[1]
#current_request = '[{"mentor":"Aaron Schram", "Companies":["Avengers Inc","Pied Piper","SHIELD ","Acme"]}]'
all_meetings = sys.argv[2]
all_companies = sys.argv[3]
#all_companies ='[{"company_id":"35ca371b-7255-4008-a163-ef975bc43368","company":"Avengers Inc","email":"avengers@example.com"},{"company_id":"4705da8c-0a3d-4431-a928-848b5cfa5794","company":"Pied Piper","email":"pied@example.com"},{"company_id":"1e2d7193-ec2b-41b7-9204-3f12133ab486","company":"SHIELD","email":"shield@example.com"},{"company_id":"18338b36-cde3-4ddd-a30d-2ccdd55ab3ca","company":"Acme","email":"acme@example.com"},{"company_id":"f2e49ca7-d029-41e6-b5b0-e9efe1b1a79b","company":"X Men","email":"xmen@example.com"},{"company_id":"687002b9-c03b-4750-91cb-ba5a5c7b78f5","company":"Xavier Corp","email":"xavier@example.com"},{"company_id":"967bdecf-9749-4c8f-8191-3e58aaee19a5","company":"Wayne Industries","email":"wayne@example.com"},{"company_id":"ee915d1c-6d62-49d4-8b42-bb5b5b86b6e6","company":"Justice League","email":"justice@example.com"},{"company_id":"e40bdbdd-bebe-4f5c-80ff-0e42a89b337d","company":"Umbrella Corp","email":"umbrella@example.com"},{"company_id":"601575cf-6290-4810-8a81-2315247c6652","company":"Olympus","email":"olympus@example.com"},{"company_id":"09678af3-f723-405c-b81b-974a64eca31d","company":"Marvel","email":"marvel@example.com"}]'
all_blocks = sys.argv[4]
#all_blocks = '[{"block_id":"7bb22961-0f0d-4dbf-bb68-5fa0f46a2934","block":"AM"},{"block_id":"f4d43f33-a4d7-4b83-9564-d2131b26d415","block":"PM"}]'
all_days = sys.argv[5]
#all_days = '[{"day_id":"a3b287f3-74bb-4b7d-98cf-2c545330f497","day":"Monday"},{"day_id":"bfbf8218-4574-4af7-bbdd-d74e19006bfa","day":"Tuesday"},{"day_id":"0b52faea-11d0-45da-a4a4-8fe361eaecdb","day":"Wednesday"},{"day_id":"2f1f7e9a-162d-498f-a1b3-b88b91ecd4c2","day":"Thursday"},{"day_id":"73ce88eb-4065-422b-a8ee-f09723c82684","day":"Friday"}]'
all_slots =sys.argv[6]
#all_slots = '[{"slot_id":"44c13927-eefa-4f20-84cd-1cf284936960","slot":"08:00:00"},{"slot_id":"0b698f98-6294-4c4a-9557-13ded144cba1","slot":"08:20:00"},{"slot_id":"b0a1ac88-bcee-4342-b852-053f78742a33","slot":"08:40:00"},{"slot_id":"7f4aa95e-2ab5-4fe9-9cbe-b072c0090b88","slot":"09:00:00"},{"slot_id":"0c7c9f65-6aad-40bf-8161-d1811f834846","slot":"09:20:00"},{"slot_id":"f9121f24-eb31-4abe-a4c9-099fe09dff53","slot":"09:40:00"},{"slot_id":"1b52f4df-cce9-4295-8fa0-6b69a315db20","slot":"10:00:00"},{"slot_id":"3c7c68fc-e26b-47b6-bbbd-afcaffe5c484","slot":"10:20:00"},{"slot_id":"0804b6ee-f464-4b82-ae2b-334d1209794c","slot":"10:40:00"},{"slot_id":"8b3b89f6-e45d-4839-a566-33370e54cede","slot":"11:00:00"},{"slot_id":"f206bf3c-f3d5-401e-8690-eb93837ad856","slot":"11:20:00"},{"slot_id":"3deff225-0ea9-4735-b539-c22a30994cce","slot":"11:40:00"},{"slot_id":"c644a7a9-792a-4ff1-a74a-6e7d0c6f91d2","slot":"13:10:00"},{"slot_id":"eaabf3cb-ba82-494c-a05f-e1c2f0703599","slot":"13:30:00"},{"slot_id":"05714321-a926-4bff-9207-91b10fcea68f","slot":"13:50:00"},{"slot_id":"ff6d9d20-2436-4ffd-92a9-a9a951893f43","slot":"14:10:00"},{"slot_id":"c2f296e0-4990-413c-99bc-08e34a2af2f9","slot":"14:30:00"},{"slot_id":"202ad20c-08a9-413e-8b18-c70ea2b15efc","slot":"14:50:00"},{"slot_id":"1c3d2fbb-1508-4949-b8e5-1346df88e5fd","slot":"15:10:00"},{"slot_id":"62b87e6e-c186-48d7-9438-0e7f3d80d11d","slot":"15:30:00"},{"slot_id":"7b858756-36d0-4ae1-a486-b7dc3cc5ac49","slot":"15:50:00"},{"slot_id":"540a0ee3-bebf-473e-9a37-0695fdeffe57","slot":"16:10:00"},{"slot_id":"9d0d21f7-955e-40a8-a30e-2a881f5eb9d1","slot":"16:30:00"},{"slot_id":"54b58b93-da4d-4925-96fc-8a10dd8773eb","slot":"16:50:00"}]'
all_mentors = sys.argv[7]
#all_mentors = '[{"mentor_id":"e7ea932f-131b-4397-b556-ac0cb0d8aaab","mentor":"Brett Jackson","email":"brett@example.com"},{"mentor_id":"6a419433-ee01-4701-a7c7-daa3020b01bc","mentor":"Brian Wallace","email":"brian@example.com"},{"mentor_id":"4cde53d2-d0f8-4257-af94-530a91de14e0","mentor":"Cheryl Kellond","email":"cheryl@example.com"},{"mentor_id":"7cbe423e-43cc-4130-8037-63313284f8c7","mentor":"Chris Marks","email":"chris@example.com"},{"mentor_id":"d7f5af89-7791-4470-84ed-3b1c8bcb51ad","mentor":"Daniel Feld","email":"daniel@example.com"},{"mentor_id":"c013120f-0fc4-49e3-9c7d-e19581ca8525","mentor":"Dave Dupont","email":"dave@example.com"},{"mentor_id":"6032f95f-6998-4bfd-949f-47cb064ad03c","mentor":"Dave Secunda","email":"daves@example.com"},{"mentor_id":"74ef1f7e-06d7-49d7-9399-57480891f8b9","mentor":"Dave Wright","email":"davew@example.com"},{"mentor_id":"ad25d60a-18a9-4d12-b2b4-178788275b30","mentor":"David Cahill","email":"david@example.com"},{"mentor_id":"8084f62c-9161-4fd0-a404-a91f47946fa8","mentor":"David Hose","email":"davidh@example.com"},{"mentor_id":"76b8d2e3-5e94-4ba5-8c7e-9f7e8d31c529","mentor":"Don Hazell","email":"don@example.com"},{"mentor_id":"34a8e6e8-712a-4c9a-b93b-3c13ce894363","mentor":"Don Loeb","email":"donl@example.com"},{"mentor_id":"327014d7-6983-4882-8d55-2f16a641ea7b","mentor":"Ed Hallen","email":"ed@example.com"},{"mentor_id":"3165a5b0-1ff1-4d89-936a-a0eebf937f3d","mentor":"Ed Roberto","email":"edr@example.com"},{"mentor_id":"014582a4-59ac-4f74-a149-f8c1332f8b1d","mentor":"Eric Kirby","email":"eric@example.com"},{"mentor_id":"7c696211-2795-42a5-ac52-fba05d103831","mentor":"Erin Rand","email":"erin@example.com"},{"mentor_id":"684e61cc-d6f7-4cbd-bb22-8d9b534141cf","mentor":"Fletcher Richman","email":"fletcher@example.com"},{"mentor_id":"c61a4146-417b-461e-b749-f4ad0cbcbd8b","mentor":"George Bilbrey","email":"george@example.com"},{"mentor_id":"4aa409bf-5151-49df-a008-4b3ab46444f9","mentor":"Hernan Aracena","email":"hernan@example.com"},{"mentor_id":"430068a4-0bb7-4c61-b27f-bb6c9604d9a5","mentor":"Howard Kaushansky","email":"howard@example.com"},{"mentor_id":"600b6e64-c1c8-4335-9540-4a99dd92acad","mentor":"Ivan Lopez","email":"ivan@example.com"},{"mentor_id":"554afb42-7905-4a00-b15e-56ee79cab474","mentor":"Jackie Young","email":"jackie@example.com"},{"mentor_id":"c75055a2-a2e9-462b-859d-8f2214c182a9","mentor":"Jackson Carson","email":"jackson@example.com"},{"mentor_id":"4d5739a5-e4da-4301-b00e-fab1110dfcdb","mentor":"Jeremy Dillingham","email":"jeremy@example.com"},{"mentor_id":"4e170bec-a2c1-41bf-84e3-122083b82e62","mentor":"Jim Franklin","email":"jim@example.com"},{"mentor_id":"f41dc8e4-1cbf-4b15-a242-cf582157c003","mentor":"Jonathan Palay","email":"jonathan@example.com"},{"mentor_id":"4259be97-c9e4-4dce-afd4-005611c7860f","mentor":"Josh Scott","email":"josh@example.com"},{"mentor_id":"ee10024d-801c-494d-845c-db7454a482f8","mentor":"Julie Penner","email":"julie@example.com"},{"mentor_id":"9534d991-236e-4e65-a947-b55b9bf2a312","mentor":"Justin Segall","email":"justin@example.com"},{"mentor_id":"6876f130-f12f-4b03-84d9-d78f3af4f0a3","mentor":"Kathy Keating","email":"kathy@example.com"},{"mentor_id":"8c6a66c6-9096-4c64-9400-3a124b9658d4","mentor":"Keely Cormier","email":"keely@example.com"},{"mentor_id":"7365e76b-743c-4560-a300-f4ed2803568a","mentor":"Kirsten Suddath","email":"kirsten@example.com"},{"mentor_id":"6eb3893f-63d0-4b54-8bb6-21cea2273153","mentor":"Kyle Kuczun","email":"kyle@example.com"},{"mentor_id":"6eb71646-ddbf-4331-baf9-5d65325341be","mentor":"Matthew Klein","email":"matthew@example.com"},{"mentor_id":"133d73ff-7eec-435d-89a4-f75a1412e667","mentor":"Matthew Loewengart","email":"matthewl@example.com"},{"mentor_id":"77a25436-473c-448a-a3e6-7960b6c16d22","mentor":"Miguel Roque","email":"miguel@example.com"},{"mentor_id":"d640814e-cb37-4a5b-813b-345b298017e0","mentor":"Mindy Nies","email":"mindy@example.com"},{"mentor_id":"88878834-47f8-46fd-9a98-191e7570487f","mentor":"Morris Wheeler","email":"morris@example.com"},{"mentor_id":"0efb1043-c482-4772-9b53-d49c416a877f","mentor":"Nancy Beaton","email":"nancy@example.com"},{"mentor_id":"92f0f5e6-dc0c-4d01-8f36-6d2ea4faf81d","mentor":"Natty Zola","email":"natty@example.com"},{"mentor_id":"e63e279a-78c7-4c15-87fd-ffa9a1dd73f7","mentor":"Nick Hofmeister","email":"nick@example.com"},{"mentor_id":"ee921739-3746-4c45-8869-d399ce31d7e1","mentor":"Nicko van Someren","email":"nicko@example.com"},{"mentor_id":"f7f7febf-18ad-400e-a7f7-bfe7f59020a4","mentor":"Niko Skievaski","email":"niko@example.com"},{"mentor_id":"fca113c9-67b5-476d-a392-c9d3a70798a8","mentor":"Nmachi Jidenma","email":"nmachhi@example.com"},{"mentor_id":"0e5bece6-1feb-40db-909e-4bbcbe605ed0","mentor":"Pascal Wagner","email":"pascal@example.com"},{"mentor_id":"703b36e4-94e7-41cc-ad79-bb7ab56ae98c","mentor":"Phil Carter","email":"phil@example.com"},{"mentor_id":"6272108f-b402-44d1-af12-c041ab26f1e9","mentor":"Rachel Fleming","email":"rachel@example.com"},{"mentor_id":"7d98b58e-c713-4bfb-976f-0b44925f13c1","mentor":"Rachel ten Brink","email":"rachel@example.com"},{"mentor_id":"1be33be8-be46-4388-9567-5b300db90611","mentor":"Rich Maloy","email":"rich@example.com"},{"mentor_id":"2a585e98-ecb2-4fc8-9ecb-d83078fd2969","mentor":"Rodrigo Sanchez-Rios","email":"rodrigo@example.com"},{"mentor_id":"127db312-6d54-4679-a6f3-6add7b2daced","mentor":"Ryan Broshar","email":"ryan@example.com"},{"mentor_id":"d3bfa3ae-b0ae-4920-b703-627345404f98","mentor":"Ryan Hunter","email":"ryanh@example.com"},{"mentor_id":"6aba6b9b-5977-4a3d-a070-ea742fc9b0e7","mentor":"Sam Laakkonen","email":"sam@example.com"},{"mentor_id":"bd8c8728-5922-4c6c-8eed-b0fdde99d0f0","mentor":"Sara Zervos","email":"sara@example.com"},{"mentor_id":"514c9f65-4a75-451e-841a-14ded84b925d","mentor":"Sasha Charlemagne","email":"sasha@example.com"},{"mentor_id":"059bf8d2-0ec0-4685-a358-861add21379a","mentor":"Scott Yates","email":"scott@example.com"},{"mentor_id":"d7dcef5d-460c-45a7-b95b-e820f459c354","mentor":"Shay Har-Noy","email":"shay@example.com"},{"mentor_id":"986378e2-a617-47b8-8ef7-f32ae925e447","mentor":"Stephan Hagemann","email":"stephan@example.com"},{"mentor_id":"bf1cc934-7df1-45f6-8282-cf6c74488ac1","mentor":"Sue Heilbronner","email":"sue@example.com"},{"mentor_id":"7ecfcfb3-8785-4738-aacb-3cf2dc8d1db1","mentor":"Tanner McGraw","email":"tanner@example.com"},{"mentor_id":"f5d045e6-2f8f-43f8-9b91-d676b5e76800","mentor":"Tim Miller","email":"tim@example.com"},{"mentor_id":"79758236-62ba-4446-9741-4ada4ae1a70e","mentor":"Toby Yoder","email":"toby@example.com"},{"mentor_id":"8ac0c9c0-7979-47cd-8535-1ddc5fd82420","mentor":"Vijay Bangaru","email":"vijay@example.com"},{"mentor_id":"489bbe15-c5ea-461e-bbc0-3ef37a5d8b0e","mentor":"Zach Nies","email":"zach@example.com"},{"mentor_id":"9e99deb6-b3e2-4345-ad8f-2bc4de6ed1c4","mentor":"Aaron Schram","email":"aaron@example.com"},{"mentor_id":"59992f06-11b9-4b23-bed4-0e5a06b5e89c","mentor":"Adam Burrows","email":"adam@example.com"},{"mentor_id":"e5b3a33e-c2fb-497e-841b-586da6dc0216","mentor":"Alex Raymond","email":"alex@example.com"},{"mentor_id":"989d98af-6b99-4d42-8af2-218f2110a2db","mentor":"Amy Kim","email":"amy@example.com"},{"mentor_id":"3e3274e2-9f4a-44d6-aa11-b8b3f641100a","mentor":"Andrea Kalmans","email":"andrea@example.com"},{"mentor_id":"334b38de-0dad-45a6-8a92-ce6d3f126887","mentor":"Anthony Christie","email":"anthony@example.com"},{"mentor_id":"25f66e58-dfc0-4f33-a1bf-cd37e0012bb2","mentor":"Ara Howard","email":"ara@example.com"},{"mentor_id":"24851a46-34ef-4460-852b-2bbf6d2bd84b","mentor":"Bart Foster","email":"bart@example.com"},{"mentor_id":"bc733938-3312-47c6-a952-a48d9b9ba7b1","mentor":"Ben Hadley","email":"ben@example.com"},{"mentor_id":"e4602aed-8f73-43bd-9828-8076e2087e59","mentor":"Blake Yeager","email":"blake@example.com"}]'

request = pd.read_json(current_request, orient='records')
meetings = pd.read_json(all_meetings, orient='records')
#meetings = pd.read_json('/home/ana/TechstarsPortfolioProject/server/algorithm/meetings.json', orient='records')
all_companies = pd.read_json(all_companies, orient='records')
all_blocks = pd.read_json(all_blocks, orient='records')
all_days = pd.read_json(all_days, orient='records')
all_slots =pd.read_json(all_slots, orient='records')
all_mentors = pd.read_json(all_mentors, orient='records')

# Taking the list of companies, and creating a list of dicts with id: company name
comps = all_companies
comps = comps["company"].unique()
comps = [x.strip() for x in comps if not pd.isnull(x) and len(x) > 0]
comp_tuples = list(enumerate(comps, 1))
companies = {k:v for (k,v) in comp_tuples}
ls = []
for k in companies:
    d = {}
    d[k] = companies[k]
    ls.append(d)
companies = ls
companies

meetings = meetings.iloc[:,1:6]

all_blocks = all_blocks.to_dict(orient='records')
for ix in range(len(all_blocks)):
    meetings['block_id'] = meetings['block_id'].replace(all_blocks[ix]['block_id'], all_blocks[ix]['block'])

all_days =all_days.to_dict(orient='records')
for i in range (len(all_days)):
    meetings['day_id'] =meetings['day_id'].replace(all_days[i]['day_id'], all_days[i]['day'])

all_slots =all_slots.to_dict(orient='records')
for i in range (len(all_slots)):
    meetings['slot_id'] =meetings['slot_id'].replace(all_slots[i]['slot_id'], all_slots[i]['slot'])

all_companies = all_companies.to_dict(orient='records')
for j in range(len(all_companies)):
    meetings['company_id'] = meetings['company_id'].replace(all_companies[j]['company_id'], all_companies[j]['company'])

all_mentors = all_mentors.to_dict(orient='records')
for j in range(len(all_mentors)):
    meetings['mentor_id'] = meetings['mentor_id'].replace(all_mentors[j]['mentor_id'], all_mentors[j]['mentor'])

meetings = meetings.dropna()

#Formatting mentor to be rescheduled data
request = request.to_dict('records')
# Changing name of companies by its id, for getting the list of companies ids
for c in range(len(request[0]["Companies"])):
    for i in range(len(companies)):
        if companies[i][i+1] == request[0]["Companies"][c].strip():
            request[0]['Companies'][c] = i+1
            break
#filling list of companies ids with fake ids to have 12 elements in the list
fake_id = 100
len_request_companies = len(request[0]['Companies'])
if len_request_companies < 12:
    for missing_id in range(len_request_companies, 12):
        request[0]['Companies'].append(fake_id)
        fake_id += 1

#Getting current day and block of the Mentor whom is going to be rescheduled
current_mentor_data = meetings[meetings['mentor_id'] == request[0]['mentor']]
if len(current_mentor_data['day_id'].unique()) == 0:
    current_mentor_days = []
    current_mentor_blocks = []
else:
    current_mentor_days = current_mentor_data['day_id'].unique()
    current_mentor_blocks = current_mentor_data['block_id'].unique()

newdf = meetings.iloc[:,:3].drop_duplicates().dropna()
newdf_AM = newdf[newdf['block_id'] == 'AM']
newdf_PM = newdf[newdf['block_id'] == 'PM']
newdf_AM = newdf_AM.reindex(['mentor_id', 'day_id', 'block_id', '08:00:00', '08:20:00', '08:40:00', '09:00:00', '09:20:00', '09:40:00', '10:00:00', '10:20:00', '10:40:00', '11:00:00', '11:20:00', '11:40:00'] , axis="columns", fill_value ="")
newdf_PM = newdf_PM.reindex(['mentor_id', 'day_id', 'block_id', '13:10:00', '13:30:00', '13:50:00', '14:10:00', '14:30:00', '14:50:00', '15:10:00', '15:30:00', '15:50:00', '16:10:00', '16:30:00', '16:50:00'], axis="columns", fill_value = "")

meetings_AM = meetings[meetings['block_id'] == 'AM']
meetings_PM = meetings[meetings['block_id'] == 'PM']
for idx, rw in newdf_AM.iterrows():
    for index, row in meetings_AM.iterrows():
        if row['mentor_id'] == rw['mentor_id'] and row['day_id'] == rw['day_id']:
            key = row['slot_id']
            value = row['company_id']
            newdf_AM.at[idx, key] = value
for idx, rw in newdf_PM.iterrows():
    for index, row in meetings_PM.iterrows():
        if row['mentor_id'] == rw['mentor_id'] and row['day_id'] == rw['day_id']:
            key = row['slot_id']
            value = row['company_id']
            newdf_PM.at[idx, key] = value

newdf_AM['Companies'] = newdf_AM.iloc[:,3:].apply(lambda x: ','.join(x), axis=1)
newdf_PM['Companies'] = newdf_PM.iloc[:,3:].apply(lambda x: ','.join(x), axis=1)

# Creating a list of dicts, each one with each mentor data (data AM)
mentors_data_AM = newdf_AM.loc[:,["mentor_id","day_id","block_id","Companies"]].to_dict('records')
for d in mentors_data_AM:
    d["Companies"] = d["Companies"].split(",")
# Changing name of companies by its id, for getting the list of companies ids
for d in range(len(mentors_data_AM)):
    for c in range(len(mentors_data_AM[d]['Companies'])):
        for i in range(len(companies)):
            if companies[i][i+1] == mentors_data_AM[d]['Companies'][c]:
                mentors_data_AM[d]['Companies'][c] = i+1
#Changing empty ids in list of companies by fake ids
for d in range(len(mentors_data_AM)):
    for cid in range(len(mentors_data_AM[d]['Companies'])):
        if mentors_data_AM[d]['Companies'][cid] == "":
            mentors_data_AM[d]['Companies'][cid] = fake_id
            fake_id += 1

# Creating a list of dicts, each one with each mentor data (data PM)
mentors_data_PM = newdf_PM.loc[:,["mentor_id","day_id","block_id","Companies"]].to_dict('records')
for d in mentors_data_PM:
    d["Companies"] = d["Companies"].split(",")
# Changing name of companies by its id, for getting the list of companies ids
for d in range(len(mentors_data_PM)):
    for c in range(len(mentors_data_PM[d]['Companies'])):
        for i in range(len(companies)):
            if companies[i][i+1] == mentors_data_PM[d]['Companies'][c]:
                mentors_data_PM[d]['Companies'][c] = i+1
#Changing empty ids in list of companies by fake ids
for d in range(len(mentors_data_PM)):
    for cid in range(len(mentors_data_PM[d]['Companies'])):
        if mentors_data_PM[d]['Companies'][cid] == "":
            mentors_data_PM[d]['Companies'][cid] = fake_id
            fake_id += 1

days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
blocks = ["AM", "PM"]

#Calling schedule function for each day and block, and saving results in a dict
dic_schedule = {}
for day in days:
    for block in blocks:
        if day not in current_mentor_days or block not in current_mentor_blocks:
            data = []
            request[0]['day_id'] = day
            request[0]['block_id'] = block
            data.append(request[0])
            if block == 'AM':
                for mentor in mentors_data_AM:
                    if mentor["day_id"].strip() == day and mentor["block_id"].strip() == block:
                        data.append(mentor)
                key = "{}_{}".format(day, block)
                #print(key)
                dic_schedule[key] = reschedule_func(data, companies)
            elif block == 'PM':
                for mentor in mentors_data_PM:
                    if mentor["day_id"].strip() == day and mentor["block_id"].strip() == block:
                        data.append(mentor)
                key = "{}_{}".format(day, block)
                #print(key)
                #print(data)
                dic_schedule[key] = reschedule_func(data, companies)

# Creating dataframes with results for each block
columns_AM = ['08:00:00', '08:20:00', '08:40:00', '09:00:00', '09:20:00', '09:40:00', '10:00:00', '10:20:00', '10:40:00', '11:00:00', '11:20:00', '11:40:00', 'Mentor', 'Day', 'Block']
columns_PM = ['13:10:00', '13:30:00', '13:50:00', '14:10:00', '14:30:00', '14:50:00', '15:10:00', '15:30:00', '15:50:00', '16:10:00', '16:30:00', '16:50:00', 'Mentor', 'Day', 'Block'] 
df_AM = pd.DataFrame()
df_PM = pd.DataFrame()
for key in dic_schedule:
    if len(dic_schedule[key]) > 0:
        if "AM" in key:
            df_AM = df_AM.append([dic_schedule[key][0]])
        else:
            df_PM = df_PM.append([dic_schedule[key][0]])

df_AM.columns = columns_AM
df_PM.columns = columns_PM

df_AM = df_AM.reindex(['Mentor', 'Day', 'Block', '08:00:00', '08:20:00', '08:40:00', '09:00:00', '09:20:00', '09:40:00', '10:00:00', '10:20:00', '10:40:00', '11:00:00', '11:20:00', '11:40:00'] , axis="columns")
df_PM = df_PM.reindex(['Mentor', 'Day', 'Block', '13:10:00', '13:30:00', '13:50:00', '14:10:00', '14:30:00', '14:50:00', '15:10:00', '15:30:00', '15:50:00', '16:10:00', '16:30:00', '16:50:00'], axis="columns")

am_json = df_AM.to_json(orient='records')
pm_json = df_PM.to_json(orient='records')
full_json = am_json[:-1] + ',' + pm_json[1:]

print(full_json, end="")