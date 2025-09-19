import { Metadata } from "next";

import { SearchParamProps } from "@/types";
import Search from "@/components/shared/Search";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { getOrdersByEvent } from "@/lib/actions/order.action";
import { IOrderItem } from "@/lib/database/models/order.model";

export const metadata: Metadata = {
  title: "Orders",
};

const Orders = async ({ searchParams }: SearchParamProps) => {
  const { eventId, searchText } = await searchParams;

  const orders = await getOrdersByEvent({
    eventId: eventId as string,
    searchString: searchText as string,
  });

  return (
    <>
      <section className=" bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left ">
          အော်ဒါများ
        </h3>
      </section>

      <section className="wrapper mt-8">
        <Search placeholder="ဝယ်သူနာမည်ဖြင့်ရှာရန်..." />
      </section>

      <section className="wrapper overflow-x-auto">
        <table className="w-full border-collapse border-t">
          <thead>
            <tr className="p-medium-14 border-b text-grey-500">
              <th className="min-w-[250px] py-3 text-left">အော်ဒါ နံပတ်</th>
              <th className="min-w-[200px] flex-1 py-3 pr-4 text-left">
                ပွဲ အမည်
              </th>
              <th className="min-w-[150px] py-3 text-left">ဝယ်သူ</th>
              <th className="min-w-[100px] py-3 text-left">ဝယ်ယူသည့် ရက်စွဲ</th>
              <th className="min-w-[100px] py-3 text-right">ပမာဏ</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length === 0 ? (
              <tr className="border-b">
                <td colSpan={5} className="py-4 text-center text-gray-500">
                  အော်ဒါမရှိပါ...
                </td>
              </tr>
            ) : (
              <>
                {orders &&
                  orders.map((row: IOrderItem) => (
                    <tr
                      key={row._id}
                      className="p-regular-14 lg:p-regular-16 border-b "
                      style={{ boxSizing: "border-box" }}
                    >
                      <td className="min-w-[250px] py-4 text-primary-500">
                        {row._id}
                      </td>
                      <td className="min-w-[200px] flex-1 py-4 pr-4">
                        {row.eventTitle}
                      </td>
                      <td className="min-w-[150px] py-4">{row.buyer}</td>
                      <td className="min-w-[100px] py-4">
                        {formatDateTime(row.createdAt).dateTime}
                      </td>
                      <td className="min-w-[100px] py-4 text-right">
                        {formatPrice(row.totalAmount)}
                      </td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default Orders;
