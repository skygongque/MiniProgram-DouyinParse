with open('result.txt', 'r', encoding='utf-8') as f:
    content_list = f.readlines()
    f.close()

c_list = []

for c in content_list:
    print(c.split('/')[2])
    c_list.append('https://'+c.split('/')[2])

c_list2 = list(set(c_list))
result = ';'.join(c_list2)
print(result)
