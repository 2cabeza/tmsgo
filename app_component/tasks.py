from woocommerce import API
from logics.local_settings import wcapi


def create_product(data):
    print('woocommerce create product', data)
    # data = {
    #     "name": "Test TMSGO test pre prod",
    #     "type": "external",
    #     "sku": "VTA101-26788",
    #     "regular_price": "21.990",
    #     "description": "Description of product",
    #     "short_description": "short description",
    #     "weight": "10",
    #     "dimensions": {"length": "10", "width": "10", "height": "10"},
    #     "categories": [
    #         {
    #             "id": 52
    #         }
    #     ],
    #     "images": [
    #         {
    #             "src": "https://firebasestorage.googleapis.com/v0/b/logics-e795d.appspot.com
    #             /o/media%2F1614629959550_screen.png?alt=media&token=7f7cf4b3-042d-4d2c-b127-e3f7934024b8"
    #         }
    #     ]
    # }
    response = None
    if data:
        response = wcapi.post("products", data).json()
        print('response task', response)
    return response

