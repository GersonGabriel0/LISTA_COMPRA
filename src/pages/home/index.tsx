import * as React from "react";
import {
  Box,
  ButtonDanger,
  ButtonPrimary,
  ButtonSecondary,
  IconAppsFilled,
  IconCoinsRegular,
  IconLogoutRegular,
  IconSettingsRegular,
  IconShoppingCartRegular,
  IconStatusChartRegular,
  IconUserAccountRegular,
  Inline,
  ResponsiveLayout,
  Stack,
  Tag,
  Text1,
  Text2,
  Text6,
  Text8,
  confirm,
} from '@telefonica/mistica'
import styles from "./Home.module.css";
import { useRouter } from "next/router";
import { CartType, CartProductType, ProductType } from "@/types/cart";
import { api } from "@/services/base";
import { formatCartDate } from "@/utilities/formatCartDate";

export default function Home() {
  const [myCarts, setMyCarts] = React.useState<CartType[]>([]);
  const [userId, setUserId] = React.useState("");
  const [userNome, setUserNome] = React.useState("");
  const [allCartProducts, setAllCartProducts] = React.useState<CartProductType[]>([]);
  const [availableProducts, setAvailableProducts] = React.useState<ProductType[]>([]);
  const [stateChange, setStateChange] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    setUserId(window.sessionStorage.getItem("userId") as string);
    handleGetUserNome();
  }, [userId]);

  React.useEffect(() => {
    handleGetUserCarts();
  }, [stateChange]);

  const handleGetUserCarts = async () => {
    if(userId) {
      try {
        await api.get(`/get/shopping_cart/user/${userId}`).then(res => setMyCarts(res.data));
        await api.get(`/get/cart_product`).then(res => setAllCartProducts(res.data));
        await api.get(`/get/products`).then(res => setAvailableProducts(res.data));
      } catch (err) {
        console.log(err);
      }
    }
  }

  const handleGetUserNome = async () => {
    setStateChange(true);
    if(userId){
      try {
        await api.get(`/get/user/${userId}`).then(res => setUserNome(res.data[0].nome));
      } catch (err) {
        console.log(err);
      }
    }
    setStateChange(false);
  }

  const handleRemoveProductFromCart = async (toRemoveProductId: string, cartId: string) => {
    const myCart = await api.get(`/get/shopping_cart/${cartId}`).then(res => res.data[0]);
    const toRemoveCartProduct = await api.get(`/get/cart_product/${cartId}/${toRemoveProductId}`).then(res => res.data[0]);;
    try{
      await api.delete(`/delete/cart_product/${cartId}/${toRemoveProductId}`);
      await api.put(`/update/shopping_cart/${cartId}`, {
        total_value: (myCart.total_value-(toRemoveCartProduct.product_value*toRemoveCartProduct.quantity)).toFixed(2),
        status: "P",
        created_at: formatCartDate(new Date(myCart.created_at)),
        updated_at: formatCartDate(new Date()),
        user_id: myCart.user_id
      });
    } catch(err) {
      console.log(err);
    }
    handleGetUserCarts();
  }

  const handleFormatDate = (date: string) => {
    const completeDate = new Date(date);
    let formattedMonth;
    let formattedDay;

    if(completeDate.getDate() > 9) {
      formattedDay = completeDate.getDate();
    }else {
      formattedDay = `0${completeDate.getDate()}`;
    }

    if(completeDate.getMonth() > 9) {
      formattedMonth = completeDate.getMonth();
    }else {
      formattedMonth = `0${completeDate.getMonth()}`;
    }

    return `${formattedDay}/${formattedMonth}/${completeDate.getFullYear()}`;
  }

  const handleUpdateCart = async (toUpdateStatus: string, cartId: string) => {
    setStateChange(true);
    const myCart = await api.get(`/get/shopping_cart/${cartId}`).then(res => res.data[0]);

    try{
      api.put(`/update/shopping_cart/${cartId}`, {
        total_value: myCart.total_value,
        status: toUpdateStatus,
        created_at: formatCartDate(new Date(myCart.created_at)),
        updated_at: formatCartDate(new Date()),
        user_id: myCart.user_id
      });
    } catch(err) {
      console.log(err);
    }
    
    setStateChange(false);
  }

  return (
    <ResponsiveLayout className={styles.main}>
      <Stack space={0}>
        <Inline space={16} alignItems="center">
          <Text8> Carrinho</Text8>
        </Inline>
        <Box paddingBottom={48} paddingTop={12}>
          <Inline space="between">
            <Inline space={16}>
              <ButtonSecondary onPress={() => { router.push("novo_carrinho") }}>
                <Text2 regular>Criar Carrinho</Text2>
              </ButtonSecondary>
              <ButtonSecondary onPress={() => { router.push("lista_produto") }}>
                <Text2 regular>Visualizar Produtos</Text2>
              </ButtonSecondary>

              <ButtonSecondary onPress={() => { 
                router.push({
                  pathname: "/editar_perfil",
                  query: {
                    userId: "1"
                  }
                }) 
              }}>
                <Text2 regular>Editar Perfil</Text2>
              </ButtonSecondary>
              <ButtonDanger onPress={() => { router.replace("/") }}>
                <Text2 regular>Sair</Text2>
              </ButtonDanger>
            </Inline>
          </Inline>
        </Box>
        <Box className={styles.main}>
          {myCarts && myCarts.length > 0
            ?
            myCarts.map((cart: CartType, index: React.Key) => (
              <Box key={index} paddingBottom={64}>
                <Box className={styles.tableInfo} padding={12} paddingTop={16}>
                  <Inline space="between">
                    <Inline space={16}>
                      <ButtonSecondary
                        disabled={cart.status !== "P"}
                        small
                        onPress={() => {
                          router.push({
                            pathname: "adc_produto_carrinho",
                            query: {
                              cartId: cart.id
                            }
                          })
                        }}
                      >
                        Adicionar produto
                      </ButtonSecondary>
                      <ButtonSecondary
                        disabled={cart.status !== "P"}
                        small
                        onPress={() => confirm({
                          title: "Gostaria de excluir o carinho mesmo?",
                          message: "",
                          acceptText: "Sim",
                          cancelText: "Não",
                          onAccept: () => { handleUpdateCart("E", cart.id) }
                        })}
                      >
                        Excluir carrinho
                      </ButtonSecondary>
                      <ButtonSecondary
                        disabled={cart.status !== "P"}
                        small
                        onPress={() => confirm({
                          title: "Vamos finalizar sua compra?",
                          message: "",
                          acceptText: "Sim",
                          cancelText: "Não",
                          onAccept: () => { handleUpdateCart("B", cart.id) }
                        })}
                      >
                        Finalizar carrinho
                      </ButtonSecondary>
                    </Inline>
                    <Inline space={12}>
                      <Tag type={cart.status == "E" ? "inactive" : "success"}>
                        {`Valor do Carinho: R$${cart.total_value.toFixed(2).toString().replace(".", ",")}`}
                      </Tag>
                      {cart.status != "E"
                        ?
                        <Tag type={cart.status == "P" ? "success" : "success"}>
                          {`Progesso: ${cart.status === "P" ? "Pendente" : "success"}`}
                        </Tag>
                        :
                        <Tag type="inactive">
                          Status: Excluído
                        </Tag>
                      }
                      <Tag type={cart.status == "E" ? "inactive" : "success"}>
                        {`Usuario: ${userNome}`}
                      </Tag>
                    </Inline>
                  </Inline>
                </Box>
                <table cellSpacing={0} cellPadding={0} className={styles.crudTable}>
                  <thead className={styles.crudHeader}>
                    <tr>
                      <th style={{ paddingLeft: "8px" }}></th>
                      <th><Text2 medium color="aqua">Nome</Text2></th>
                      <th><Text2 medium color="aqua">Marca</Text2></th>
                      <th><Text2 medium color="aqua">Descrição</Text2></th>
                      <th><Text2 medium color="aqua">Quantidade</Text2></th>
                      <th><Text2 medium color="aqua">Valor</Text2></th>
                      <th><Text2 medium color="aqua"></Text2></th>
                      <th><Text2 medium color="aqua"></Text2></th>
                    </tr>
                  </thead>
                  <tbody className={styles.crudBody}>
                    {allCartProducts.map((cartProduct: CartProductType, index: number) => {
                      const isProductInCart = cart.id == cartProduct.shopping_cart_id;
                      if(isProductInCart) {
                        const product = availableProducts.find(availableProduct => availableProduct.id == cartProduct.product_id);
                        if(product) {
                          return (
                            <tr className={styles.crudRow} key={index}>
                              <td style={{ paddingLeft: "8px" }}></td>
                              <td><Text1 medium wordBreak>{product.name}</Text1></td>
                              <td><Text1 medium wordBreak>{product.brand}</Text1></td>
                              <td style={{ width: "150px" }}><Text1 medium truncate>{product.description}</Text1></td>
                              <td><Text1 medium>{cartProduct.quantity}</Text1></td>
                              <td><Text1 medium>R${cartProduct.product_value.toFixed(2).toString().replace(".", ",")}</Text1></td>
                              <td>
                                <ButtonSecondary
                                  disabled={cart.status !== "P"}
                                  onPress={() => confirm({
                                    title: "Excluir Produto",
                                    message: "",
                                    acceptText: "Sim",
                                    cancelText: "Não",
                                    onAccept: () => handleRemoveProductFromCart(product.id, cart.id)
                                  })} small
                                >
                                  Remover Produto
                                </ButtonSecondary>
                              </td>
                            </tr>
                          )
                        }
                      }
                    })}
                  </tbody>
                </table>
                
              </Box>
            ))
            :
            <Box>
              <Text6>Buscando Arquivos</Text6>
            </Box>
          }
        </Box>
      </Stack>
    </ResponsiveLayout>
  )
}
