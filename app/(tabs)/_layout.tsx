import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      // ESTA ES LA LÍNEA MÁGICA: Destruye el componente de la barra por completo
      tabBar={() => null}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="two" options={{ href: null }} />
    </Tabs>
  );
}
