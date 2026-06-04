import React from "react";
import cepPromise from "cep-promise";
import { applyCepMask, onlyDigits } from "../utils/inputMasks";

const initialAddress = {
  cep: "",
  rua: "",
  numero: "",
  bairro: "",
  cidade: "",
  complemento: "",
};

const idleStatus = { loading: false, error: "", resolved: false };

export function useCepAddress() {
  const [address, setAddress] = React.useState(initialAddress);
  const [cepStatus, setCepStatus] = React.useState(idleStatus);
  const cepRequestId = React.useRef(0);

  React.useEffect(() => {
    const digits = onlyDigits(address.cep);

    if (digits.length === 0 || digits.length < 8) {
      cepRequestId.current += 1;
      setCepStatus(idleStatus);
      return undefined;
    }

    const requestId = cepRequestId.current + 1;
    cepRequestId.current = requestId;
    setCepStatus({ loading: true, error: "", resolved: false });

    const timeoutId = window.setTimeout(async () => {
      try {
        const result = await cepPromise(digits, { timeout: 5000 });

        if (cepRequestId.current !== requestId) return;

        setAddress((currentAddress) => ({
          ...currentAddress,
          cep: applyCepMask(result.cep),
          rua: result.street || currentAddress.rua,
          bairro: result.neighborhood || currentAddress.bairro,
          cidade: result.city || currentAddress.cidade,
        }));
        setCepStatus({ loading: false, error: "", resolved: true });
      } catch (error) {
        if (cepRequestId.current !== requestId) return;

        const message =
          error?.type === "validation_error"
            ? "CEP deve conter exatamente 8 dígitos."
            : "CEP não encontrado. Confira o número ou preencha o endereço manualmente.";

        setCepStatus({ loading: false, error: message, resolved: false });
      }
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [address.cep]);

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setAddress((currentAddress) => ({
      ...currentAddress,
      [name]: name === "cep" ? applyCepMask(value) : value,
    }));
  }

  function validateCep() {
    const cepDigits = onlyDigits(address.cep);

    if (cepDigits.length === 8) return true;

    setCepStatus({
      loading: false,
      error: "Informe um CEP válido com 8 dígitos.",
      resolved: false,
    });
    return false;
  }

  return {
    address,
    cepStatus,
    handleFieldChange,
    validateCep,
  };
}
