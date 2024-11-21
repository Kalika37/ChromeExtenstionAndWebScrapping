# import the required library
from bs4 import BeautifulSoup,Tag,NavigableString 
import requests,json
from googletrans import Translator
headers = requests.utils.default_headers()
translator=Translator()
target="https://kathmandupost.com"
class HTMLParser:
    def __init__(self,url) -> None:
        self.url=url
        headers.update(
            {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            }
        )
        
        response:requests.Response=requests.request(method="GET",url=url,headers=headers)
        soup=BeautifulSoup(response.content,features="html.parser")
        self.content=response.text
        tag:Tag
        self.contentsdict=[]
        self.soup=soup
        articles=soup.find_all("article")
        i=3
        proceed=True
        if url==target:
         while len(articles)>i:
            if proceed:
                proceed=False
                tag=articles[i]
                i+=1
                anchor=tag.find("a")
                href=url+anchor.get_attribute_list("href")[0]
                if href:
                    description=HTMLParser(href)
                    descriptiontext=description.soup.find("div", attrs={"class":"page-detail--content clearfix"}).find("div", attrs={"class":"subscribe--wrapperx"})
                    updatetime=description.soup.find("div", attrs={"class":"updated-time"})
                    updatelocation=description.soup.find("div", attrs={"class":"updated-time updated-time_location"})
                    proceed=True
                    
                    if descriptiontext:
                        dictdata={
                                "title":tag.text,
                                "text":descriptiontext.text,
                                "date":"today",
                                "place":"kathmandu",
                                "subject":"today News"
                            }
                        if updatelocation:
                            dictdata["place"]=updatelocation.text
                        if updatetime:
                            dictdata["date"]= updatetime.text.split(":")[1]
                        self.contentsdict.append(dictdata) 
                          
                        
                
target_parse=HTMLParser(target)

string=json.dumps(target_parse.contentsdict)
with open("today_news.json", "w+") as f:
    f.write(string)
    f.close()
