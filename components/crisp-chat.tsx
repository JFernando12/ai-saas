'use client'

import { useEffect } from "react"
import { Crisp } from "crisp-sdk-web"

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure('799bdc8a-4e1d-4a99-8e81-77457e64658c')
  }, []);

  return null;
};