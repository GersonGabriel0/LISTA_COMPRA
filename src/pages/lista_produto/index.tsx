import * as React from "react";
import {
  Box,
  ButtonDanger,
  ButtonPrimary,
  ButtonSecondary,
  IconAppsFilled,
  IconChevronLeftRegular,
  IconLogoutRegular,
  IconSettingsRegular,
  Inline,
  ResponsiveLayout,
  Stack,
  Text1,
  Text2,
  Text8,
  confirm,
} from '@telefonica/mistica'
import styles from "./lista_produto.module.css";
import { useRouter } from "next/router";
import { ProductType } from "@/types/cart";
import { api } from "@/services/base";

export default function ListProducts() {
  const router = useRouter();
  const [storeProducts, setStoreProducts] = React.useState<ProductType[]>([]);

  React.useEffect(() => {
    handleGetProducts();
  }, []);

  const handleGetProducts = async () => {
    try {
      await api.get("/get/products").then(res => setStoreProducts(res.data));
    } catch(err) {
      console.log(err);
    }
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

  const handleDeleteProduct = async (productId: string) => {
    try {
      await api.delete(`/delete/product/${productId}`);
      handleGetProducts();
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <ResponsiveLayout className={styles.main}>
      <Stack space={0}>
        <Text8>Lista de Produtos</Text8>
        <Box paddingBottom={48} paddingTop={12}>
          <Inline space="between">
            <Inline space={16}>
              <ButtonSecondary onPress={() => { router.push("/home") }}>
                <Text2 regular>Home</Text2>
              </ButtonSecondary>
              <ButtonSecondary onPress={() => { router.push("novo_produto") }}>
                <Text2 regular>Novo Produto</Text2>
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
          <table cellSpacing={0} cellPadding={0} className={styles.crudTable}>
            <thead className={styles.crudHeader}>
              <tr>
                <th><Text2 medium color="aqua">Nome</Text2></th>
                <th><Text2 medium color="aqua">Marca</Text2></th>
                <th><Text2 medium color="aqua">Preço</Text2></th>
                <th style={{ width: "250px" }}><Text2 medium color="aqua">Descrição</Text2></th>
                <th><Text2 medium color="aqua"></Text2></th>
                <th><Text2 medium color="aqua"></Text2></th>
                <th><Text2 medium color="aqua"></Text2></th>
              </tr>
            </thead>
            <tbody className={styles.crudBody}>
              {storeProducts && storeProducts.length > 0
                ?
                storeProducts.map((product: ProductType, index: React.Key) => (
                  <tr className={styles.crudRow} key={index}>
                    <td><Text1 medium wordBreak>{product.name}</Text1></td>
                    <td><Text1 medium wordBreak>{product.brand}</Text1></td>
                    <td><Text1 medium>R${product.price.toFixed(2).toString().replace(".", ",")}</Text1></td>
                    <td><Text1 medium truncate>{product.description}</Text1></td>
                    <td><Text1 medium> </Text1></td>
                    <td>
                      <ButtonSecondary
                        onPress={() => { 
                          router.push({
                            pathname: "/editar_produto",
                            query: {
                              productId: product.id
                            }
                          })
                        }} 
                        small
                      >
                        Editar
                      </ButtonSecondary>
                    </td>
                    <td>
                      <ButtonDanger
                        onPress={() => confirm({
                          title: "Gostaria de excluir o produto?",
                          message: "",
                          acceptText: "Sim",
                          cancelText: "Não",
                          onAccept: () => handleDeleteProduct(product.id)
                        })} small
                      >
                        Deletar
                      </ButtonDanger>
                    </td>
                  </tr>
                ))
                :
                <tr>
                  <td>Atualizando....</td>
                </tr>
              }
            </tbody>
          </table>
        </Box>
      </Stack>
    </ResponsiveLayout>
  )
}
