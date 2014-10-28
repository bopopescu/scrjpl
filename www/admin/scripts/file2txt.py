from subprocess import Popen, PIPE
from docx import opendocx, getdocumenttext

from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from cStringIO import StringIO

import os
import sys

def convert_pdf_to_txt(path):
    rsrcmgr = PDFResourceManager()
    retstr = StringIO()
    laparams = LAParams()
    device = TextConverter(rsrcmgr, retstr, codec='utf-8', laparams=laparams)
    fp = file(path, 'rb')
    interpreter = PDFPageInterpreter(rsrcmgr, device)
    pagenos = set()
    for page in PDFPage.get_pages(fp, pagenos, maxpages=0, password="",caching=True, check_extractable=True):
        interpreter.process_page(page)
    fp.close()
    device.close()
    str = retstr.getvalue()
    retstr.close()
    return str

def file2text(file_path):
    if file_path[-4:] == ".doc":
        os.chdir('antiword')
        cmd = ['antiword', file_path]
        p = Popen(cmd, stdout=PIPE)
        stdout, stderr = p.communicate()
        return stdout.decode('ascii', 'ignore')
    elif file_path[-5:] == ".docx":
        document = opendocx(file_path)
        paratextlist = getdocumenttext(document)
        newparatextlist = []
        for paratext in paratextlist:
            newparatextlist.append(paratext.encode("utf-8"))
        return '\n\n'.join(newparatextlist)
    elif file_path[-4:] == ".odt":
        cmd = ['odt2txt', file_path]
        p = Popen(cmd, stdout=PIPE)
        #stdout, stderr = p.communicate()
        r = [x.decode('iso-8859-1').encode('utf-8') for x in p.stdout.readlines()]
        return ''.join(r)
    elif file_path[-4:] == ".pdf":
        return convert_pdf_to_txt(file_path)

if __name__ == "__main__":
    if (len(sys.argv) == 2) :
        os.chdir(os.path.dirname(__file__))
        print file2text(sys.argv[1])
