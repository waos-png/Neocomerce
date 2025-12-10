package com.neocommerce.mapper;

import com.neocommerce.dto.cart.CartResponse;
import com.neocommerce.entity.Cart;
import com.neocommerce.entity.CartItem;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public final class CartMapper {

    private CartMapper() {}

    public static CartResponse toDto(Cart cart) {
        if (cart == null) return null;

        BigDecimal total = BigDecimal.ZERO;
        List<CartResponse.CartItemResponse> items = new ArrayList<>();

        for (CartItem item : cart.getItems()) {
            if (item == null || item.getProduct() == null) {
                continue; // evitar NullPointer si el producto fue eliminado
            }

            BigDecimal subtotal = item.getSubtotal();
            if (subtotal != null) {
                total = total.add(subtotal);
            }

            items.add(new CartResponse.CartItemResponse(
                    item.getId(),
                    item.getProduct().getId(),
                    item.getProduct().getProductName(),
                    item.getProduct().getImageUrl(),
                    item.getQuantity(),
                    item.getPriceAtAdd(),
                    subtotal
            ));
        }

        return new CartResponse(
                cart.getId(),
                cart.getUsuario().getId(),
                cart.getActive(),
                cart.getCreadoEn(),
                items,
                total
        );
    }
}
