#!/usr/bin/env python
# Name: Gwydion Oostvogel
# Student number: 12578002

import sys
import re
import json


def read_txt(infile):
    data = {}
    with open(infile, 'r') as file:
        for line in file:
            if '#' in line:
                continue
            string_list = re.sub('[\n\t ]', '', line).split(',')
            try:
                data_list = [int(val) for val in string_list]
                data[data_list[1]] = {'TG': data_list[2], 'UG': data_list[3]}
            except ValueError:
                pass
    file.close()
    return data


def write_json(dict):
    with open(sys.argv[1] + '.json', 'w') as outfile:
        json.dump(dict, outfile)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Error: incorrect number of arguments")
        sys.exit(1)
    write_json(read_txt(sys.argv[1]+'.txt'))