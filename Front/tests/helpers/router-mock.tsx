// Mock simples do expo-router: Link vira um Pressable e os params vêm de uma variável.
import { Pressable } from 'react-native';

export const routerState: { params: Record<string, string | string[]> } = { params: {} };

export const expoRouterMock = {
  Link: ({ children, href, asChild }: { children: React.ReactElement; href: string; asChild?: boolean }) =>
    asChild ? children : <Pressable accessibilityRole="link" accessibilityHint={href}>{children}</Pressable>,
  useLocalSearchParams: () => routerState.params,
  Stack: () => null,
};
