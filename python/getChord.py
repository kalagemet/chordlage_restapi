from lxml import html
import requests
import re
import cloudscraper
import hashlib
import json
# from bs4 import BeautifulSoup

def getJudul(link):

    # Adding Browser / User-Agent Filtering should help ie. 

    # will give you only desktop firefox User-Agents on Windows
    scraper = cloudscraper.create_scraper(browser={'browser': 'firefox','platform': 'windows','mobile': False})

    page = scraper.get(link).content

    # soup = BeautifulSoup(page, 'html.parser')
    data = html.fromstring(page)

    # print(data)
    # print(soup)

    # define an alphabet
    alfa = "abcdefghijklmnopqrstuvwxyz0123456789"
    # define reverse lookup dict
    rdict = dict([ (x[1],x[0]) for x in enumerate(alfa) ])
    title = data.xpath('//div[@class="post"]//h1//a/text()')
    
    judul = title[0].split(' - ',1)[1]
    penyanyi = title[0].split(' - ',1)[0]
    penyanyi = penyanyi.split('Gitar ',1)[1]
    abjad = rdict[penyanyi[0][:1].lower()]
    if(abjad>25):
        abjad = 0
    else :
        abjad = abjad+2
    content = data.xpath('//div[@class="post-body entry-content"]//pre//node()')

    content = ''.join(str(i).lower() for i in content)
    content = re.sub(r'>(\w+)<', lambda match: r'>{}<'.format(match.group(1).title()) , str(content))
    content = re.sub(r'<element.+?>', ':s1:', str(content))
    # content = re.sub(r'<Element a.+?>', '<span>', str(content))
    # content = re.sub(r'<Element span.+?>', '</span>', str(content))
    content = encode(content)
    print("Posting ke server ...")
    # TODO: #1 API doesn't work
    url = 'https://lagu.api.hamidmusafa.com/post'
    headers = {
        'Accept': 'text/plain',
        'User-Agent': 'Mozilla/5.0',
        "apa": "79fa2fcaecf5c83c299cd96e2ba44710",
        "Content-Type": "application/json",
        'method':'POST'    
    }
    flag = input("Kategori :")
    key = hashlib.md5("whattheapks".encode('utf-8')).hexdigest()
    data = {
            'judul' : judul.replace('Chord Dasar',''),
            'nama_band' : penyanyi,
            'chord': content,
            'abjad' : abjad,
            'created_by' : 0,
        }
    data['token'] = hashlib.md5((json.dumps(data, separators=(',', ':'))+key).encode('utf-8')).hexdigest()
    data = json.dumps(data, separators=(',', ':'))
    x = requests.post(url, headers=headers, data=data)
    # print(data)
    print(x.text)

def encode(isi) :
    data = isi
    data = data.replace("          " ,":s10:")
    data = data.replace("         ",":s9:")
    data = data.replace("        ",":s8:")
    data = data.replace("       ",":s7:")
    data = data.replace("      ",":s6:")
    data = data.replace("     ",":s5:")
    data = data.replace("    ",":s4:")
    data = data.replace("   ",":s3:")
    data = data.replace("  ",":s2:")
    data = data.replace(" ",":s1:")
    data = data.replace("\r\n\r\n\r\n\r\n\r\n",":x5:")
    data = data.replace("\r\n\r\n\r\n\r\n",":x4:")
    data = data.replace("\r\n\r\n\r\n",":x3:")
    data = data.replace("\r\n\r\n",":x2:")
    data = data.replace("\r\n",":x1:")
    data = data.replace("f#", "Gb")
    data = data.replace("g#","Ab")
    data = data.replace("a#","Bb")
    data = data.replace("c#","Db")
    data = data.replace("d#","Eb")
    
    return data

def main():
    while(True):
        print("Post New Chord")
        # url = 'https://www.chordtela.com/2021/09/yeni-inka-tak-antem-watu.html'
        url = input("Url Chordtela :")
        if(url=='exit'):
            return False
        else:
            print("Mengambil data ...")
            try:
                data = getJudul(url)
            except Exception as e:
                print("error - "+str(e))

if __name__ == '__main__':
    main()