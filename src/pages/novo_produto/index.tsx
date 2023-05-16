import * as React from "react";
import {
  Box,
  ButtonPrimary,
  ButtonSecondary,
  ButtonDanger,
  DateField,
  DecimalField,
  IconClickAndCollectRegular,
  Inline,
  ResponsiveLayout,
  Stack,
  Text4,
  Text8,
  TextField,
  alert,
  ErrorFeedbackScreen,
} from '@telefonica/mistica'
import styles from "./novo_produto.module.css";
import { useRouter } from "next/router";
import { api } from "@/services/base";

export default function NewProduct() {
  const [name, setName] = React.useState("");
  const [brand, setBrand] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [expirationDate, setExpirationDate] = React.useState("");
  const router = useRouter();

  const validateFields = () => {
    if(
      name.length < 1 ||
      brand.length < 1 
    ){
      return true;
    }else {
      return false;
    }
  }

  const handleAddNewProduct = async () => {
    try{
      await api.post("/create/product", {
        name,
        brand,
        price: Number(price.replace(",", ".")),
        expiration_date: expirationDate,
        description
      });
      alert({
        title: "Produto cadastrado",
        message: "",
        acceptText: "Voltar",
        onAccept() { router.replace("/lista_produto") },
      });
    } catch(err) {
      console.log(err);
      <ErrorFeedbackScreen
        title="Produto não cadastrado!!"
        description=""
        primaryButton={<ButtonPrimary onPress={() => {}} label="Fechar" />}
      />
    }
  }

  return (
    <ResponsiveLayout className={styles.main}>
      <Box className={styles.centerContent}>
        <Box paddingX={16}>
          <Stack space={8}>
            <Text8>Criar Produto</Text8>
          </Stack>
          <Stack space={0}>
            <Box paddingTop={32}>
              <TextField 
                label="Nome"
                name="product-name"
                value={name}
                onChangeValue={setName}
              />
            </Box>
            <Box paddingTop={12}>
              <TextField 
                label="Marca"
                name="product-brand"
                value={brand}
                onChangeValue={setBrand}
              />
            </Box>
            <Box paddingTop={12}>
              <TextField 
                label="Descrição"
                name="product-description"
                value={description}
                onChangeValue={setDescription}
                multiline
              />
            </Box>
            <Box paddingTop={12}>
              <DecimalField 
                label="Valor"
                name="product-price"
                value={price}
                onChangeValue={setPrice}
              />
            </Box>
          </Stack>
          <Box paddingTop={40}>
            <Inline space={16}>
              <ButtonDanger onPress={router.back}>
                Retornar
              </ButtonDanger>
              <ButtonSecondary disabled={validateFields()} onPress={() => {handleAddNewProduct()}}>
                Cadastrar
              </ButtonSecondary>
            </Inline>
          </Box>
        </Box>
      </Box>
    </ResponsiveLayout>
  );
}  