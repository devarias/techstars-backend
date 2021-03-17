from ortools.sat.python import cp_model
import numpy as np
import pandas as pd
import sys
from schedule_restrictive import schedule_restrictive


# Load de data and save it in a dataframe
input_json = sys.argv[1]
mentors_comp = pd.read_json(input_json, orient='records')
mentors_comp = mentors_comp[mentors_comp["Name"] != ""]
mentors_comp = mentors_comp.iloc[:,:-2]

# Taking the list of companies, and creating a list of dicts with id: company name
comps = mentors_comp.iloc[:,4:].values.ravel()
comps = pd.unique(comps)
comps = [x.strip() for x in comps if not pd.isnull(x) and len(x) > 0]
comp_tuples = list(enumerate(comps, 1))
companies = {k:v for (k,v) in comp_tuples}
ls = []
for k in companies:
    d = {}
    d[k] = companies[k]
    ls.append(d)
companies = ls

# Creating a list of dicts, each one with each mentor data
mentors_comp['Companies'] = mentors_comp.iloc[:,4:].apply(lambda x: ','.join(x.dropna().astype(str)), axis=1)

mentors_data = mentors_comp.loc[:,["Name","Email","Day","AM/PM","Companies"]].to_dict('records')
for d in mentors_data:
    d["Companies"] = d["Companies"].split(",")
    d['Companies'] = list(filter(lambda x: len(x) > 0, d['Companies']))
    for i in range(len(d['Companies'])):
        d['Companies'][i] = d['Companies'][i].strip()

# Changing name of companies by its id, for getting the list of companies ids
for d in range(len(mentors_data)):
    for c in range(len(mentors_data[d]['Companies'])):
        for i in range(len(companies)):
            if companies[i][i+1] == mentors_data[d]['Companies'][c]:
               mentors_data[d]['Companies'][c] = i+1

#filling list of companies ids with fake ids to have 12 elements in the list
fake_id = 100
for d in range(len(mentors_data)):
    len_comp = len(mentors_data[d]['Companies'])
    if len_comp < 12:
        for missing_id in range(len_comp, 12):
            mentors_data[d]['Companies'].append(fake_id)
            fake_id += 1

days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
blocks = ["AM", "PM"]

#Calling schedule function for each day and block, and saving results in a dict
dic_schedule = {}
for day in days:
    for block in blocks:
        data = []
        for mentor in mentors_data:
            if mentor["Day"].strip() == day and mentor["AM/PM"].strip() == block:
                data.append(mentor)
        key = "{}_{}".format(day, block)
        dic_schedule[key] = schedule_restrictive(data, companies)


# Creating dataframes with results for each block
columns_AM = ['08:00:00', '08:20:00', '08:40:00', '09:00:00', '09:20:00', '09:40:00', '10:00:00', '10:20:00', '10:40:00', '11:00:00', '11:20:00', '11:40:00', 'Mentor', 'Email', 'Day', 'Block']
columns_PM = ['13:10:00', '13:30:00', '13:50:00', '14:10:00', '14:30:00', '14:50:00', '15:10:00', '15:30:00', '15:50:00', '16:10:00', '16:30:00', '16:50:00', 'Mentor', 'Email', 'Day', 'Block'] 
df_AM = pd.DataFrame()
df_PM = pd.DataFrame()
for key in dic_schedule:
    if "AM" in key:
        df_AM = df_AM.append(dic_schedule[key])
    else:
        df_PM = df_PM.append(dic_schedule[key])
df_AM.columns = columns_AM
df_PM.columns = columns_PM
df_AM = df_AM.reindex(['Mentor', 'Email', 'Day', 'Block', '08:00:00', '08:20:00', '08:40:00', '09:00:00', '09:20:00', '09:40:00', '10:00:00', '10:20:00', '10:40:00', '11:00:00', '11:20:00', '11:40:00'] , axis="columns")
df_PM = df_PM.reindex(['Mentor', 'Email', 'Day', 'Block', '13:10:00', '13:30:00', '13:50:00', '14:10:00', '14:30:00', '14:50:00', '15:10:00', '15:30:00', '15:50:00', '16:10:00', '16:30:00', '16:50:00'], axis="columns")


fulldf = pd.concat([df_AM, df_PM])
fulldf_json = fulldf.to_json(orient='records')

print(fulldf_json, end="")