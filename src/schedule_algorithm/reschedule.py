from ortools.sat.python import cp_model
import numpy as np
import pandas as pd
import sys
from reschedule_func import reschedule_func

current_request = sys.argv[1]
all_meetings = sys.argv[2]
all_companies = sys.argv[3]
all_blocks = sys.argv[4]
all_days = sys.argv[5]
all_slots =sys.argv[6]
all_mentors = sys.argv[7]

request = pd.read_json(current_request, orient='records')
meetings = pd.read_json(all_meetings, orient='records')
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


fulldf = pd.concat([df_AM, df_PM])
fulldf_json = fulldf.to_json(orient='records')
print(fulldf_json, end="")
