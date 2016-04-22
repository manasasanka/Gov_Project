__author__ = 'aterry'
from bs4 import BeautifulSoup
import re
file_names= "ForbesRSSArticles/"
articles = open("CleanedForbesArticles.txt", "w+")
files = []
article_pattern =re.compile('"body":"(.*?)"description"',re.DOTALL)


for i in range(1,403):
    files.append(file_names+'/'+str(i)+".txt")
for name in files:
    file = open(name,"r+")
    soup = BeautifulSoup(file, 'html.parser')
    title = str(soup.title).replace('<title meta-title="">',"")
    title = title.replace("<title>","")
    title = title.replace("</title>","")
    paras = ""
    p = str(soup.find_all("script"))
    body= article_pattern.findall(p)
    	
    if body is not []:
	b=str(body)
        p=''
    	paras+=b[1:len(b)-1]
        i=0
 	while i<len(paras):
                ch = paras[i]
                if ch == '<':
                    while ch!= '>':
                        ch = paras[i]
                        i+= 1
                else:
                    p +=ch
                    i+=1
      
    if p!="":
        articles.write(title)
    	articles.write('\n')
	articles.write(p)
    	articles.write('\n')
    	articles.write('\n')
    	articles.write('\n')


