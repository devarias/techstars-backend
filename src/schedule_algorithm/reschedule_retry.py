from ortools.sat.python import cp_model
import numpy as np
import pandas as pd

#Trying to reschedule with different restrictions
def reschedule_retry(data, companies):
    """Rescheduling programm"""
    # Create the model.
    model = cp_model.CpModel()

    line_size = 12 # number of slots for meetings
    line = list(range(0, line_size))
    rows = list(range(len(data)))

    ls_m_c = [data[k].get('Companies') for k in rows]

    initial_grid = []
    initial_grid.append(list(np.zeros(12,dtype=int)))

    for ls in range(1,len(ls_m_c)):
        initial_grid.append(ls_m_c[ls])

    grid = {}
    for i in rows:
           for j in line:
                grid[(i, j)] =  model.NewIntVarFromDomain(cp_model.Domain.FromValues(ls_m_c[i]), 'grid %i %i' % (i, j))

    #AllDifferent on rows.
    for i in rows:
        model.AddAllDifferent([grid[(i, j)] for j in line])

    # AllDifferent on columns.
    for j in line:
        model.AddAllDifferent([grid[(i, j)] for i in rows])

    #Adding objectives:
    #for i in rows:
    if ls_m_c[0][8] < 100 and ls_m_c[0][10] > 100:
        model.Add(grid[(0, 5)] >= 100)
        model.Add(grid[(0, 9)] >= 100)

    elif ls_m_c[0][7] < 100:
        model.Add((grid[(0,0)] + grid[(0,1)] + grid[(0, 2)]) < 100)
        model.Add((grid[(0,3)]) >= 100)
        model.Add((grid[(0,4)] + grid[(0, 5)] + grid[(0, 6)]) < 100)
        model.Add((grid[(0,7)]) >= 100)
        model.Add((grid[(0,8)] + grid[(0, 9)]) < 100)

    elif ls_m_c[0][6] < 100:
        model.Add((grid[(0,3)] + grid[(0,4)] + grid[(0,5)]) < 100)
        model.Add((grid[(0,7)] + grid[(0, 8)] + grid[(0, 9)] + grid[(0, 10)]) < 100)

    elif ls_m_c[0][5] < 100:
        model.Add((grid[(0,1)] + grid[(0,2)] + grid[(0, 3)]) < 100)
        model.Add((grid[(0,4)]) >= 100)
        model.Add((grid[(0, 5)] + grid[(0, 6)] + grid[(0, 7)]) < 100)

    elif ls_m_c[0][4] < 100:
        model.Add((grid[(0,1)] + grid[(0,2)]) < 100)
        model.Add((grid[(0,3)]) >= 100)
        model.Add((grid[(0, 4)] + grid[(0, 5)] + grid[(0, 6)]) < 100)

    elif ls_m_c[0][3] < 100:
        model.Add((grid[(0,7)] + grid[(0, 8)]) < 100)
        model.Add((grid[(0, 9)] + grid[(0, 10)]) < 100)

    elif ls_m_c[0][2] < 100:
        model.Add((grid[(0,8)] + grid[(0, 9)] + grid[(0,10)]) < 100)

    elif ls_m_c[0][1] < 100:
        model.Add((grid[(0,8)] + grid[(0, 9)]) < 100)

    #Initial values.
    for i in rows:
        for j in line:
            if initial_grid[i][j] != 0:
                model.Add(grid[(i, j)] == initial_grid[i][j])

    # Solve and save a list with values.
    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status == cp_model.OPTIMAL:
        ls = []
        for i in rows:
            ls.append([int(solver.Value(grid[(i, j)])) for j in line])

    try:
        #Removing fake ids
        for m in range(len(ls)):
            for cl in range(len(ls[m])):
                if ls[m][cl] > len(companies):
                    ls[m][cl] = np.nan

       # Change companies' ids by its name
        for l in range(len(ls)):
            for col in range(len(ls[l])):
                if ls[l][col]:
                    for c in companies:
                        if ls[l][col] in c:
                            com = c.get(ls[l][col])
                            ls[l][col] = com

        #Appending to ls: mentors' name, day and block, to have a more complete list for using it later to recreate the dataframe
        ls_mentors = [data[i].get('mentor_id') for i in range(len(data))]
        ls_mentors[0] = data[0].get('mentor')
        for i in range(len(ls_mentors)):
            ls[i].append(ls_mentors[i])
            #ls[i].append(data[i].get('Email'))
            ls[i].append(data[i].get('day_id'))
            ls[i].append(data[i].get('block_id'))
        return (ls)

    except:
        #print('There is no feasible solution')
        #retry = schedule_retry(data, companies)
        return([])