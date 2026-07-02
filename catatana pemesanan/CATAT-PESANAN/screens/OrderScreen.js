import React, { useState } from "react";
import {
View,
Text,
TextInput,
TouchableOpacity,
FlatList,
StyleSheet,
SafeAreaView,
Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
addOrder,
deleteOrder,
finishOrder,
} from "../database/database";

const formatRupiah = (num) =>
"Rp " +
Number(num || 0)
.toString()
.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function OrderScreen({
  orders = [],
  refreshOrders,
}) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selected, setSelected] = useState(null);

  const [name, setName] = useState("");
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");

  const filtered = orders.filter((item) =>
    item?.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const saveOrder = async () => {
    try {
      console.log("Tombol Simpan Ditekan");

      if (
        !name.trim() ||
        !product.trim() ||
        !price.trim() ||
        !qty.trim()
      ) {
        Alert.alert(
          "Peringatan",
          "Semua data harus diisi"
        );
        return;
      }

      const total =
        Number(price) * Number(qty);

      console.log("Menyimpan data...");

      await addOrder(
        name,
        product,
        Number(price),
        Number(qty),
        total
      );

      console.log("Data berhasil disimpan");

      if (refreshOrders) {
        await refreshOrders();
      }

      setName("");
      setProduct("");
      setPrice("");
      setQty("");

      setShowForm(false);

      Alert.alert(
        "Berhasil",
        "Pesanan berhasil disimpan"
      );
    } catch (err) {
      console.log(
        "ERROR SIMPAN:",
        err
      );

      Alert.alert(
        "Error",
        err?.message ||
          "Gagal menyimpan data"
      );
    }
  };

  if (showForm) {
    const total =
      Number(price || 0) *
      Number(qty || 0);

    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Tambah Pesanan
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nama Pelanggan"
              placeholderTextColor="#94a3b8"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="cube-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Produk"
              placeholderTextColor="#94a3b8"
              value={product}
              onChangeText={setProduct}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="pricetag-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Harga"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="scale-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Jumlah Kg/pcs"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={qty}
              onChangeText={setQty}
            />
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>
              Estimasi Total Biaya
            </Text>
            <Text style={styles.summaryValue}>
              {formatRupiah(total)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.btnPrimary}
            activeOpacity={0.8}
            onPress={saveOrder}
          >
            <Ionicons name="save-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.btnText}>
              Simpan Pesanan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() =>
              setShowForm(false)
            }
          >
            <Ionicons name="arrow-back-outline" size={20} color="#475569" style={{ marginRight: 8 }} />
            <Text style={styles.btnSecondaryText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (showDetail && selected) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Detail Pesanan
          </Text>

          <View style={styles.detailCard}>
            <View style={styles.avatarRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {selected.name?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.detailName}>{selected.name}</Text>
                <View style={[
                  styles.statusBadge,
                  selected.status === "Selesai" ? styles.statusSelesai : styles.statusProses
                ]}>
                  <Text style={[
                    styles.statusText,
                    selected.status === "Selesai" ? styles.textSelesai : styles.textProses
                  ]}>
                    {selected.status}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Produk</Text>
              <Text style={styles.detailValue}>{selected.product}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Jumlah</Text>
              <Text style={styles.detailValue}>{selected.qty} Kg/pcs</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tanggal</Text>
              <Text style={styles.detailValue}>{selected.date || "-"}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Pembayaran</Text>
              <Text style={styles.totalValue}>{formatRupiah(selected.total)}</Text>
            </View>
          </View>

          {selected.status !== "Selesai" && (
            <TouchableOpacity
              style={styles.btnSuccess}
              onPress={async () => {
                await finishOrder(
                  selected.id
                );
                await refreshOrders();
                setShowDetail(
                  false
                );
              }}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text
                style={styles.btnText}
              >
                Tandai Selesai
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.btnDanger}
            onPress={async () => {
              Alert.alert(
                "Konfirmasi Hapus",
                "Apakah Anda yakin ingin menghapus pesanan ini?",
                [
                  { text: "Batal", style: "cancel" },
                  {
                    text: "Hapus",
                    style: "destructive",
                    onPress: async () => {
                      await deleteOrder(
                        selected.id
                      );
                      await refreshOrders();
                      setShowDetail(false);
                    }
                  }
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text
              style={styles.btnText}
            >
              Hapus
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() =>
              setShowDetail(false)
            }
          >
            <Ionicons name="arrow-back-outline" size={20} color="#475569" style={{ marginRight: 8 }} />
            <Text style={styles.btnSecondaryText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>
          Daftar Pesanan
        </Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#94a3b8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari pelanggan..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) =>
            item.id.toString()
          }
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() => {
                setSelected(item);
                setShowDetail(true);
              }}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardCustomerName}>
                  {item.name}
                </Text>
                <View style={[
                  styles.statusBadge,
                  item.status === "Selesai" ? styles.statusSelesai : styles.statusProses
                ]}>
                  <Text style={[
                    styles.statusText,
                    item.status === "Selesai" ? styles.textSelesai : styles.textProses
                  ]}>
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.cardInfoRow}>
                <Ionicons name="cube-outline" size={14} color="#64748b" style={{ marginRight: 4 }} />
                <Text style={styles.cardProductText}>
                  {item.product}
                </Text>
                <Text style={styles.bulletSeparator}>•</Text>
                <Ionicons name="scale-outline" size={14} color="#64748b" style={{ marginRight: 4 }} />
                <Text style={styles.cardQtyText}>
                  {item.qty} Kg/pcs
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.cardTotalLabel}>Total:</Text>
                <Text style={styles.cardTotalValue}>
                  {formatRupiah(item.total)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() =>
            setShowForm(true)
          }
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingTop: 25,
  },

  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 16,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#1e293b",
  },

  summaryCard: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    padding: 16,
    marginVertical: 15,
    alignItems: "center",
  },

  summaryLabel: {
    fontSize: 13,
    color: "#2563EB",
    marginBottom: 4,
  },

  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1D4ED8",
  },

  btnPrimary: {
    backgroundColor: "#3B82F6",
    flexDirection: "row",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  btnSecondary: {
    backgroundColor: "#f1f5f9",
    flexDirection: "row",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },

  btnSecondaryText: {
    color: "#475569",
    fontWeight: "bold",
  },

  btnSuccess: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  btnDanger: {
    backgroundColor: "#EF4444",
    flexDirection: "row",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  detailCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },

  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  detailName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 16,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  detailLabel: {
    color: "#64748b",
    fontSize: 14,
  },

  detailValue: {
    color: "#1e293b",
    fontWeight: "600",
    fontSize: 14,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    color: "#0f172a",
    fontWeight: "bold",
    fontSize: 15,
  },

  totalValue: {
    color: "#2563EB",
    fontWeight: "bold",
    fontSize: 20,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },

  statusSelesai: {
    backgroundColor: "#DEF7EC",
  },

  statusProses: {
    backgroundColor: "#FEF3C7",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "bold",
  },

  textSelesai: {
    color: "#03543F",
  },

  textProses: {
    color: "#D97706",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
    color: "#1e293b",
  },

  orderCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  cardCustomerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },

  cardInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  cardProductText: {
    fontSize: 13,
    color: "#64748b",
  },

  bulletSeparator: {
    marginHorizontal: 8,
    color: "#cbd5e1",
  },

  cardQtyText: {
    fontSize: 13,
    color: "#64748b",
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 10,
  },

  cardTotalLabel: {
    fontSize: 13,
    color: "#64748b",
  },

  cardTotalValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2563EB",
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});
