import * as React from "react";
import styles from "@/styles/Login.module.css";
import FiRefreshCcw  from '../../public/favicon.ico';
import {
  Box,
  ButtonSecondary,
  ButtonDanger,
  EmailField,
  PasswordField,
  ResponsiveLayout,
  Stack,
  Text8,
  Inline,
  ErrorFeedbackScreen,
  ButtonPrimary,
} from "@telefonica/mistica";
import { useRouter } from "next/router";
import { api } from "@/services/base";

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [showError, setShowError] = React.useState(false);
  const router = useRouter();

  const handleUserLogin = async () => {
    try {
      await api
        .post("/login", {
          email,
          senha,
        })
        .then((res) => window.sessionStorage.setItem("userId", res.data[0].id));
      router.push("/home");
    } catch (err) {
      console.log(err);
      setShowError(true);
    }
  };

  if (showError) {
    return (
      <ErrorFeedbackScreen
        title="Email ou senha incorreta"
        description="Por favor, verifique seus dados"
        primaryButton={
          <ButtonPrimary onPress={() => setShowError(false)}>
            Tentar novamente
          </ButtonPrimary>
        }
        link={
          <ButtonSecondary onPress={() => router.push("/register")}>
            Cadastre-se
          </ButtonSecondary>
        }
      />
    );
  }

  return (
    <ResponsiveLayout className={styles.main}>
      <Box className={styles.centerContent}>
        <Box paddingX={16}>
          <Stack space={8}>
            <Text8>Loja_UnC</Text8>
          </Stack>
          <Box paddingTop={8}>
            <EmailField
              label="E-mail"
              name="email-input"
              value={email}
              onChangeValue={setEmail}
            />
          </Box>
          <Box paddingTop={24}>
            <PasswordField
              label="Senha"
              name="senha-input"
              value={senha}
              onChangeValue={setSenha}
            />
          </Box>
          <Box paddingTop={56}>
            <Inline space={16}>
              <ButtonSecondary isLoading icon={<FiRefreshCcw />} onPress={() => handleUserLogin()}>
                Login
              </ButtonSecondary>
              <ButtonDanger onPress={() => router.push("/register")}>
                Cadastre-se
              </ButtonDanger>
            </Inline>
          </Box>
          <Box paddingTop={32}></Box>
        </Box>
      </Box>
    </ResponsiveLayout>
  );
}