import xml.etree.ElementTree
import urllib2

file_name = "new/"


#Basic recursive tree traversing, will print elements
#with no children

def findchild(root):
	for child in root:
		if child.getchildren() == []:
			text = fixstr(child.text)
			print(child.tag + " --- " + text)
		else:
			print(child.tag)
			findchild(child)


#Same as above, except this one you can specify if you
#want a certain tag, like below where I used it to find
#the links to the articles
i = 0
def findchild(root, tag):
	for child in root:
		if (child.getchildren() == []) & (child.tag == tag):
			article = urllib2.urlopen(fixstr(child.text))
			file = open(file_name + str(i) +'.txt',"w+")
			file.write(article.read())
			file.close()
			global i
			i+=1
		else:
			findchild(child,tag)


#Utility function to fix some string conversion errors I was getting
def fixstr(st):
	if type(st) == str:
		text = st.encode('utf-8').decode('ascii','ignore')
	else:
		text = ""
	return text


#Added some other links as well which are missing here
urls = ['http://rss.cnn.com/rss/money_news_international.rss', 'http://rss.cnn.com/rss/edition_technology.rss']

#These two lines get the XML from the url and change it into
#a tree which can be traversed
for url in urls:
	print url
	e = xml.etree.ElementTree.parse(urllib2.urlopen(url))
	root = e.getroot()
	findchild(root,"link")