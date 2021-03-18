from ortools.sat.python import cp_model
import numpy as np
import pandas as pd

#Last try to schedule
def schedule_retry2(data, companies):
    """Try it Schedule with less restrictions"""
    # Create the model.
    model = cp_model.CpModel()

    line_size = 12 # number of slots for meetings
    line = list(range(0, line_size))
    rows = list(range(len(data)))

    ls_m_c = [data[k].get('Companies') for k in rows]
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
    for i in rows:
        if ls_m_c[i][8] < 100 and ls_m_c[i][10] > 100:
            model.Add(grid[(i, 5)] >= 100)
            model.Add(grid[(i, 9)] >= 100)

        elif ls_m_c[i][7] < 100:
            model.Add((grid[(i,3)]) >= 100)
            model.Add((grid[(i,7)]) >= 100)
            model.Add((grid[(i,11)]) >= 100)

        elif ls_m_c[i][6] < 100:
            model.Add((grid[(i,3)] + grid[(i, 4)] + grid[(i, 5)]) < 100)
            model.Add((grid[(i,7)] + grid[(i,8)] + grid[(i,9)] + grid[(i,10)]) < 100)


        elif ls_m_c[i][5] < 100:
            model.Add((grid[(i,1)] + grid[(i,2)] + grid[(i, 3)]) < 100)
            model.Add((grid[(i, 5)] + grid[(i, 6)] + grid[(i, 7)]) < 100)

        elif ls_m_c[i][4] < 100:
            model.Add((grid[(i,1)] + grid[(i,2)]) < 100)
            model.Add((grid[(i,3)]) >= 100)
            model.Add((grid[(i, 4)] + grid[(i, 5)] + grid[(i, 6)]) < 100)

        elif ls_m_c[i][3] < 100:
            model.Add((grid[(i,7)] + grid[(i, 8)]) < 100)
            model.Add((grid[(i, 9)] + grid[(i, 10)]) < 100)

        elif ls_m_c[i][2] < 100:
            model.Add((grid[(i,8)] + grid[(i, 9)] + grid[(i,10)]) < 100)

        elif ls_m_c[i][1] < 100:
            model.Add((grid[(i,8)] + grid[(i, 9)]) < 100)


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
        ls_mentors = [data[i].get('Name') for i in range(len(data))]
        for i in range(len(ls_mentors)):
            ls[i].append(ls_mentors[i])
            ls[i].append(data[i].get('Email'))
            ls[i].append(data[i].get('Day'))
            ls[i].append(data[i].get('AM/PM'))
        return (ls)

    except:
        #print('There is no deasible solution')
        return([])