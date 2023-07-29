import os
import xlrd
import re

from progress.spinner import Spinner
from slugify import slugify
import zipfile
from app_catalog.models import ImportFile, Category, Brand, Product, datetime, Images
from progress.bar import FillingSquaresBar


def import_products(instance=None):
    print('import')
    files = []
    if instance:
        files.append(instance)
    else:
        files = ImportFile.objects.filter(uploaded=False).order_by('-created')

    for file in files:
        if file.remove_all:
            try:
                # Images.objects.all().delete()
                # Category.objects.all().delete()
                Brand.objects.all().delete()
                Product.objects.all().delete()
            except Exception as ex:
                print(ex)

        bar = FillingSquaresBar('Processing ' + file.file.name, max=0)
        org = file.organization
        currency = file.currency
        path = 'media/upload/' + file.file.name
        print(path)

        path_split = str(file.file.name).split('/')
        path_files = '/'.join(path_split[0:(len(path_split) - 1)]) + '/'
        print('path_files', path_files)
        dir_images = ''

        # open and extract all files in the zip
        bar_zip = Spinner('Processing ZIP' + file.images_zip.name)
        try:
            password = None
            with zipfile.ZipFile(file.images_zip.file, "r") as z:
                z.extractall(pwd=password, path='media/upload/{}'.format(path_files),)
                for info in z.infolist():
                    if info.is_dir():
                        if 'foto' in info.filename.lower():
                            dir_images = info.filename
                            bar_zip.next()
        except Exception as ex:
            print('Error Zip', ex)
            pass
        z.close()
        # dir_images = '{}{}'.format(path_files, dir_images)
        print('dir_images', dir_images)

        workbook = xlrd.open_workbook(path, ragged_rows=True)
        errors_repeat = []
        errors_matching = []
        sh = workbook.sheet_by_index(0)
        virtual = True
        bar.max = sh.nrows

        for rx in range(1, sh.nrows):
            name = _cell(sh, rx, 1)
            model = _cell(sh, rx, 2)
            brand = _cell(sh, rx, 3)
            sku = _cell(sh, rx, 4)
            cat1 = _cell(sh, rx, 5)
            cat2 = _cell(sh, rx, 6)
            cat3 = _cell(sh, rx, 7)
            cat4 = _cell(sh, rx, 8)
            description = _cell(sh, rx, 14)
            img1 = _cell(sh, rx, 15)

            img2 = _cell(sh, rx, 16)
            img3 = _cell(sh, rx, 17)
            img4 = _cell(sh, rx, 18)

            # generate brands and models
            brands = [brand, model]
            brands_ids = []
            parent = None
            for brand_ in brands:
                if brand_:
                    brand_ = brand_
                    brand_object = get_or_create_brand(org, brand_, parent, virtual)
                    if brand_object:
                        brands_ids.clear()
                        brands_ids.append(str(brand_object.id))
                        parent = brand_object.id

            # create product
            product, created = Product.objects.get_or_create(organization=org, sku=sku, currency=currency)
            product.name = name
            product.slug = slugify(name)
            product.price_1 = 100
            product.brand_id = ','.join(brands_ids)
            product.stock_status = 'instock'
            product.image = path_files + dir_images + img1
            product.currency = currency
            product.short_description = str(description).capitalize()[0:25] + '...'
            product.description = str(description).capitalize()

            # category relations
            categories = [cat1, cat2, cat3, cat4]
            parent = None
            for cat in categories:
                if cat:
                    cat = cat
                    category = get_or_create_category(org, cat, parent, virtual)
                    if category:
                        parent = category.id
                        product.categories.add(category)

            # generate extra images
            if not virtual:
                images = [img1, img2, img3, img4]
                for image in images:
                    if image:
                        image = image
                        path_image = '{}{}{}'.format(path_files, dir_images, image)
                        image_object = get_or_create_image(org, image, 'IMG_{}'.format(currency), path_image)
                        if image_object:
                            product.images.add(image_object)


            virtual = False
            product.save()
            bar.next()
        file.uploaded = True
        file.save()
        print('save')
        print('file', file)


def get_or_create_category(org=None, category_name=None, parent_id=None, virtual=False):
    try:
        if category_name:
            category, created = Category.objects.get_or_create(name=category_name, organization=org)
            category.style = 'category'
            category.virtual = virtual
            if parent_id:
                category.parent_id = parent_id
            else:
                category.parent = None
            category.save()
            return category
        else:
            return None
    except Exception as ex:
        print(ex)
        return None


def get_or_create_brand(org=None, brand_name=None, parent_id=None, virtual=False):
    try:
        if brand_name:
            brand, created = Brand.objects.get_or_create(name=brand_name, organization=org)
            brand.virtual = virtual
            if parent_id:
                brand.parent_id = parent_id
            brand.save()
            return brand
        else:
            return None
    except Exception as ex:
        print(ex)
        return None


def get_or_create_image(org=None, image_name=None, code=None, image_=None):
    try:
        if image_name:
            image, created = Images.objects.get_or_create(name=image_name, code=code, organization=org)
            image.image = image_
            image.save()
            return image
        else:
            return None
    except Exception as ex:
        print(ex)
        return None


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

