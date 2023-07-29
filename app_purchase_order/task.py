import os
import xlrd
import re

from progress.spinner import Spinner
from slugify import slugify
import zipfile
from app_catalog.models import ImportFile, Category, Brand, Product, datetime, Images
from progress.bar import FillingSquaresBar

from .models import ImportFileOrderDetail, PurchaseOrderDetail


def import_products(instance=None):
    print('import')
    files = []
    if instance:
        files.append(instance)
    else:
        files = ImportFileOrderDetail.objects.filter(uploaded=False).order_by('-created')
    print(instance)

    for file in files:

        print('file.purchase_order', file.purchase_order)
        path = 'media/upload/' + file.file.name
        print(path)
        path_split = str(file.file.name).split('/')
        path_files = '/'.join(path_split[0:(len(path_split) - 1)]) + '/'
        print('path_files', path_files)

        workbook = xlrd.open_workbook(path, ragged_rows=True)
        sh = workbook.sheet_by_index(0)
        # bar.max = sh.nrows

        for rx in range(1, sh.nrows):
            code_1 = _cell(sh, rx, 0)
            description = _cell(sh, rx, 1)
            quantity = _cell(sh, rx, 2)
            price_1 = _cell(sh, rx, 3)
            price_2 = _cell(sh, rx, 4)
            print(code_1, ' | ', description,  ' | ', quantity,  ' | ', price_1)
            item, created = PurchaseOrderDetail.objects.get_or_create(code_1=code_1, description=description)
            item.quantity = quantity
            item.price_1 = price_1
            item.price_2 = price_2
            item.purchase_order = file.purchase_order
            item.save()
            if item:
                print('upload ok')
                file.uploaded = True
                file.save()
            # bar.next()
        # file.uploaded = True
        # file.save()
        print('save')


def _cell(sh, rx, cell_number):
    result_value = None
    try:
        cell = sh.cell(rx, cell_number).value
        if cell:
            if str(cell).strip() != "":
                result_value = cell
    except:
        pass
    return result_value
