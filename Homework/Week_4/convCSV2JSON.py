import pandas as pd
import sys


def conv_json(infile, index_col, columns, filter_by):
    df_raw = pd.read_csv(infile+'.csv')
    df_raw.columns = [c.lower().replace(' ', '_') for c in df_raw.columns]

    if filter_by:
        for i in range(len(filter_by)):
            df_raw = df_raw[df_raw[filter_by[i][0]] == filter_by[i][-1]]
        print("Filter done")

    if "ALL" not in columns:
        df_raw = df_raw[columns].copy()
        print("Column selection done")

    df = df_raw.dropna(axis=0, how='any', inplace=False)

    if index_col != '':
        df = df.set_index(index_col, verify_integrity=True)
        print("Index column done")
        print(df)

    df.to_json(infile+".json", orient="index")
    print("Write to JSON done")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Error: incorrect number of arguments\nUsage: Python convertCSV2JSON.py name infile")
        sys.exit(1)
    filter_by = []
    columns = []
    print("Index column (press enter to skip) > ", end='')
    index_col = input()
    columns.append(index_col)
    print(index_col, "added")
    print(index_col, "set to index column")

    while 1:
        print("Columns to include (type HELP for commands) > ", end='')
        user_in = input()

        if user_in == "DONE":
            break

        elif user_in == "DEL":
            print(columns.pop(), "removed")

        elif user_in == "FILTER":
            print("Filter on which column > ", end='')
            f_col = input()
            print("Value to filter > ", end='')
            f_val = input()
            if not f_val.isalpha():
                try:
                    filter_by.append([f_col, int(f_val)])
                except ValueError:
                    print("Value must be a number, try again")
                    filter_by = []
            else:
                filter_by.append([f_col, f_val])

        elif user_in == "UNDO FILTER":
            filter_by.pop()
            print("Last filter removed")

        elif user_in == "HELP":
            print('"ALL" : include all columns\n"DONE" : go to next step\n"DEL" : remove last entry\n'
                  '"FILTER" : filter data by column value\n"UNDO FILTERS" : removes last filter\n'
                  '"END" : exit program')
        elif user_in == "END":
            sys.exit(0)
        elif user_in not in columns:
            columns.append(user_in)
            print(user_in, "added")

    conv_json(sys.argv[1], index_col, columns, filter_by)

