import * as React from "react";
import { 
  Box,
  ButtonPrimary, 
  ButtonSecondary, 
  Inline, 
  IntegerField, 
  ResponsiveLayout, 
  Select, 
  Stack, 
  Text4,
  Text8,
  alert, 
} from '@telefonica/mistica'
import styles from "./adc_produto_carrinho.module.css";
import { useRouter } from "next/router";
import { api } from "@/services/base";
import { CartProductType, ProductType } from "@/types/cart";
import { formatCartDate } from "@/utilities/formatCartDate";

export default function AddProductToCart() {
  const [availableProducts, setAvailableProducts] = React.useState<ProductType[]>([]);
  const [selectedProduct, setSelectedProduct] = React.useState("");
  const [newQuantity, setNewQuantity] = React.useState("");
  const [cartProducts, setCartProducts] = React.useState<CartProductType[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    handleGetProducts();
    handleFetchCartProducts();
  }, []);

  const handleGetProducts = async () => {
    try {
      await api.get(`/get/products`).then(res => setAvailableProducts(res.data));
    } catch (err) {
      console.log(err);
    }
  }

  const handleFetchCartProducts = async () => {
    const { cartId } = router.query;
    await api.get(`/get/cart_product/${cartId}`).then(res => setCartProducts(res.data));
  }

  const handleAddProductToCart = async () => {
    const { cartId } = router.query;
    const productToAdd = availableProducts.find(availableProduct => availableProduct.id.toString() == selectedProduct);

    if(productToAdd) {
      if(cartProducts.length > 0) {
        const existingProductIndex = cartProducts.findIndex((cartProduct: CartProductType) => cartProduct.product_id.toString() === selectedProduct);
        const myCart = await api.get(`/get/shopping_cart/${cartId}`).then(res => res.data[0]);

        if (existingProductIndex == -1) {
          try{
            await api.post("/create/cart_product", {
              shopping_cart_id: cartId,
              product_id: Number(selectedProduct),
              quantity: Number(newQuantity),
              created_at: formatCartDate(new Date()),
              total_value: (productToAdd.price*Number(newQuantity)).toFixed(2),
              product_value: productToAdd.price.toFixed(2)
            });
            await api.put(`/update/shopping_cart/${cartId}`, {
              total_value: (myCart.total_value+(productToAdd.price*Number(newQuantity))).toFixed(2),
              status: "P",
              created_at: formatCartDate(new Date(myCart.created_at)),
              updated_at: formatCartDate(new Date()),
              user_id: myCart.user_id
            });
            alert({
              title: "Produto adicionado",
              message: "",
              acceptText: "Voltar",
              onAccept() { router.replace("/home") },
            });
          } catch(err) {
            console.log(err);
          }
        }else {
          const toUpdateProduct = cartProducts[existingProductIndex];
          try{
            await api.put(`/update/cart_product/${cartId}/${toUpdateProduct.product_id}`, {
              quantity: (toUpdateProduct.quantity+Number(newQuantity)),
              created_at: formatCartDate(new Date(toUpdateProduct.created_at)),
              total_value: (toUpdateProduct.product_value*(toUpdateProduct.quantity+Number(newQuantity))).toFixed(2),
              product_value: toUpdateProduct.product_value.toFixed(2)
            });
            await api.put(`/update/shopping_cart/${cartId}`, {
              total_value: (myCart.total_value+(toUpdateProduct.product_value*Number(newQuantity))).toFixed(2),
              status: "P",
              created_at: formatCartDate(new Date(myCart.created_at)),
              updated_at: formatCartDate(new Date()),
              user_id: myCart.user_id
            });
            alert({
              title: "Produto Adicionado",
              message: "",
              acceptText: "Retornar",
              onAccept() { router.replace("/home") },
            });
          } catch(err) {
            console.log(err);
          }
        }
      }
    }
  }

  return (
    <ResponsiveLayout className={styles.main}>
      <Box className={styles.centerContent}>
        <Stack space={0}>
          <Text8>Adicionar produto</Text8>
          <Box paddingTop={64}>
            <Select 
              name="adc_carrinho"
              label="Produtos"
              options={availableProducts.map((availableProduct) => ({
                text: availableProduct.name,
                value: String(availableProduct.id),
              }))}
              onChangeValue={setSelectedProduct}
            />
          </Box>
          <Box paddingTop={24}>
            <IntegerField 
              label="Quantidade"
              name="product-quantity"
              onChangeValue={setNewQuantity}
              value={newQuantity}
            />
          </Box>
          <Box paddingTop={80}>
            <Inline space={16}>
              <ButtonSecondary onPress={router.back}>
                Retornar
              </ButtonSecondary>
              <ButtonSecondary
                disabled={!selectedProduct || !newQuantity}
                onPress={handleAddProductToCart}
              >
                Adicionar
              </ButtonSecondary>
            </Inline>
          </Box>
        </Stack>
      </Box>
    </ResponsiveLayout>
  );
  
}