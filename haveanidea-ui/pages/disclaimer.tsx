import React from 'react';
import Layout from '../components/Layout';

export default function Disclaimer(): React.ReactElement {
  return (
    <Layout>
      <div className="px-4 lg:px-12 max-w-screen-2xl mx-auto py-10 md:py-14">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">免责声明与一般风险警告</h1>

        <section className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
          <p>
            这些条款构成您（“您”或“您的”）与 RootData（“我们”或“我们的”）之间具有法律约束力的协议。这些条款管辖您对在平台上或通过平台或以其他方式提供给您的 RootData 服务的使用。
            通过注册 RootData 帐户、访问平台和/或使用 RootData 服务，您同意您已阅读、理解并接受这些条款以及这些条款中提及的任何其他文件或条款。您承认并同意您将受这些条款的约束并将遵守这些条款（不时更新和修订）。
            如果您不理解和接受这些条款的全部内容，则不应注册 RootData 帐户或访问或使用平台或任何 RootData 服务。
          </p>

          <h2>1. 不提供投资建议</h2>
          <p>
            我们不提供与我们的产品或服务相关的投资建议。RootData 平台上显示和提供的信息均来自公开市场或互联网。我们不保证其真实性或准确性，也不构成任何投资、财务或交易建议或任何其他类型的推荐。
            您应根据个人投资目的、财务状况和风险承受能力，自行决定任何投资、投资策略或相关交易是否适合您。
          </p>

          <h2>2. 市场风险</h2>
          <p>
            数字资产及其交易面临巨大的市场风险和价格波动。价值变动可能非常剧烈，且可能在没有任何预警的情况下迅速发生。您可能无法按成本收回投资本金。
          </p>

          <h2>3. 流动性风险</h2>
          <p>
            数字资产的流动性可能有限，这可能导致您难以或无法立即出售或退出。此类流动性受限可能随时发生。
          </p>

          <h2>4. 数字资产相关风险</h2>
          <p>
            数字资产的价值与其他任何资产一样，可能会出现大幅波动。买卖、持有或投资数字资产均存在重大财务损失的风险。因此，请根据自身的财务状况考虑是否适合持有数字资产。
          </p>

          <h2>5. 不背书</h2>
          <p>
            RootData 上出现的第三方广告和超链接并不构成 RootData 的任何认可、保证、担保或推荐。在决定使用任何第三方服务之前，请自行进行尽职调查。
          </p>

          <h2>6. 关联方披露</h2>
          <p>
            RootData 可能会从联盟链接中获取利润。该利润可能以金钱或服务的形式存在，并且可能无需网站访问者的任何操作即可实现。如果您执行与联盟链接相关的操作，则您理解 RootData 可能会获得某种形式的利润。
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400">最后更新日期：{new Date().toISOString().slice(0,10)}</p>
        </section>
      </div>
    </Layout>
  );
}
