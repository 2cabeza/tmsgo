from django.core.validators import FileExtensionValidator
from django.db import models
from django.contrib.auth.models import Group
from slugify import slugify
from app_general.models import MetaModel
from logics.utils import *
from django.utils.translation import ugettext_lazy as _
from model_utils.models import TimeStampedModel, SoftDeletableModel
from app_general.models import *


STOCK_STATUS = (
    ('instock', _('instock')),
    ('outofstock', _('outofstock')),
    ('onbackorder', _('onbackorder')),
)

OBJECT_STATUS = (
    ('publish', _('publish')),
    ('pending', _('pending')),
    ('private', _('private')),
    ('draft', _('draft')),
)

CURRENCY = (
    ('CLP', 'Peso Chileno (CLP)'),
    ('PEN', 'Sol (PEN)'),
)


class Images(TimeStampedModel, SoftDeletableModel, OrganizationRelatedModel):
    name = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_('name'))
    alt = models.CharField(
        blank=True,
        null=True,
        max_length=255,
        verbose_name=_('alt'))
    code = models.CharField(
        blank=True,
        null=True,
        max_length=100,
        verbose_name=_('code'))
    image = models.ImageField(
        upload_to=settings.RELATIVE_IMAGE_PATH,
        verbose_name=_('image')
    )

    class Meta:
        verbose_name = _('image')
        verbose_name_plural = _('images')

    def __str__(self):
        return "{}".format(self.name)


class BaseModel(models.Model):
    name = models.CharField(
        max_length=250,
        verbose_name=_('name'))
    slug = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name=_('slug'))
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('description'))
    image = models.ImageField(
        upload_to=settings.RELATIVE_IMAGE_PATH,
        blank=True,
        null=True,
        verbose_name=_('image')
    )
    images = models.ManyToManyField(
        Images,
        blank=True,
        verbose_name=_('images'),
    )
    style = models.CharField(
        max_length=255,
        default='',
        blank=True,
        verbose_name=_('style'))
    state = models.CharField(
        max_length=255,
        choices=OBJECT_STATUS,
        default='publish',
        verbose_name=_('state'))

    class Meta:
        abstract = True


class Slide(BaseModel, OrganizationRelatedModel):
    parent = models.ForeignKey(
        'Slide',
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('parent')
    )
    order = models.IntegerField(
        default=0,
        blank=True,
        null=True,
        verbose_name=_('order'))
    virtual = models.BooleanField(
        default=False,
        verbose_name=_('virtual'))

    class Meta:
        verbose_name = _('slide')
        verbose_name_plural = _('slides')

    def __str__(self):
        return "{}".format(self.name)


class Brand(BaseModel, OrganizationRelatedModel):
    parent = models.ForeignKey(
        'Brand',
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('parent')
    )
    order = models.IntegerField(
        default=0,
        blank=True,
        null=True,
        verbose_name=_('order'))
    virtual = models.BooleanField(
        default=False,
        verbose_name=_('virtual'))

    class Meta:
        verbose_name = _('brand')
        verbose_name_plural = _('brands')

    def __str__(self):
        return "{}".format(self.name)


class Category(BaseModel, OrganizationRelatedModel):
    parent = models.ForeignKey(
        'Category',
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('parent')
    )
    icon_file = models.ImageField(
        upload_to=settings.RELATIVE_IMAGE_PATH,
        blank=True,
        null=True,
        verbose_name=_('icon file')
    )
    order = models.IntegerField(
        default=0,
        blank=True,
        null=True,
        verbose_name=_('order'))
    virtual = models.BooleanField(
        default=False,
        verbose_name=_('virtual'))

    class Meta:
        verbose_name = _('category')
        verbose_name_plural = _('categories')

    def __str__(self):
        return "{}".format(self.name)


class Dimensions(models.Model):
    length = models.DecimalField(
        default=0,
        blank=True,
        null=True,
        max_digits=12,
        decimal_places=1,
        verbose_name=_('length')
    )
    width = models.DecimalField(
        default=0,
        blank=True,
        null=True,
        max_digits=12,
        decimal_places=1,
        verbose_name=_('width')
    )
    height = models.DecimalField(
        default=0,
        blank=True,
        null=True,
        max_digits=12,
        decimal_places=1,
        verbose_name=_('height')
    )

    class Meta:
        verbose_name = _('dimension')
        verbose_name_plural = _('dimensions')
        abstract = True


class Product(BaseModel, TimeStampedModel, SoftDeletableModel, Dimensions, OrganizationRelatedModel):
    sku = models.CharField(
        max_length=250,
        blank=True,
        null=True,
        verbose_name=_('sku'))
    short_description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('short description'))
    currency = models.CharField(
        max_length=255,
        choices=CURRENCY,
        blank=True,
        null=True,
        verbose_name=_('currency'))
    price_1 = models.DecimalField(
        blank=True,
        null=True,
        max_digits=12,
        decimal_places=2,
        verbose_name=_('price 1')
    )
    price_2 = models.DecimalField(
        blank=True,
        null=True,
        max_digits=12,
        decimal_places=2,
        verbose_name=_('price 2')
    )
    weight = models.DecimalField(
        blank=True,
        null=True,
        max_digits=12,
        decimal_places=1,
        verbose_name=_('weight')
    )
    manage_stock = models.BooleanField(
        default=False,
        verbose_name=_('manage stock'))
    stock_quantity = models.IntegerField(
        blank=True,
        null=True,
        verbose_name=_('stock quantity'))
    stock_status = models.CharField(
        max_length=255,
        choices=STOCK_STATUS,
        verbose_name=_('stock status'))
    parent = models.ForeignKey(
        'Product',
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('parent')
    )
    brand = models.ForeignKey(
        Brand,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('brand')
    )
    categories = models.ManyToManyField(
        Category,
        blank=True,
        verbose_name=_('categories')
    )
    virtual = models.BooleanField(
        default=False,
        verbose_name=_('virtual'))

    class Meta:
        verbose_name = _('product')
        verbose_name_plural = _('products')

    def __str__(self):
        variations = ''
        if self.parent:
            variations = '({})'.format(_('variations'))
        return "{} {}".format(self.name, variations)


class MetaData(MetaModel):
    product = models.ForeignKey(
        Product,
        blank=True,
        on_delete=models.CASCADE,
        verbose_name=_('product')
    )

    class Meta:
        verbose_name = _('meta data')
        verbose_name_plural = _('meta data')

    def __str__(self):
        return "{}".format(self.id)


class ImportFile(TimeStampedModel, SoftDeletableModel, OrganizationRelatedModel):
    file = models.FileField(
        upload_to=settings.RELATIVE_IMAGE_PATH,
        default='',
        verbose_name=_('file'))
    images_zip = models.FileField(
        upload_to=settings.RELATIVE_IMAGE_PATH,
        blank=True,
        null=True,
        validators=[FileExtensionValidator(allowed_extensions=['zip'])],
        verbose_name=_('images zip'))
    currency = models.CharField(
        max_length=255,
        choices=CURRENCY,
        blank=True,
        null=True,
        verbose_name=_('currency'))
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('description'),
    )
    uploaded = models.BooleanField(
        default=False,
        verbose_name=_('uploaded')
    )
    remove_all = models.BooleanField(
        default=False,
        verbose_name=_('remove all')
    )
    user_created = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=_('user created')
    )

    class Meta:
        verbose_name = _('import file')
        verbose_name_plural = _('import files')

    def __str__(self):
        return "{}".format(self.description)


@receiver(post_save, sender=Category)
@prevent_recursion
def save_category(sender, instance=None, created=False, **kwargs):
    """
    Save category
    """
    try:
        instance.slug = slugify(instance.name)
    except Exception as ex:
        print(ex)


@receiver(post_save, sender=ImportFile)
@prevent_recursion
def gen_import(sender, instance=None, created=False, **kwargs):
    """
    execute Import
    """
    if instance.uploaded is False:
        from app_catalog.tasks import import_products
        import_products(instance)
