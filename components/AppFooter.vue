<script setup lang="ts">
  const { footer } = useAppConfig()

  const links = []
</script>

<template>
  <UFooter class="bg-[#F1F6FBED] dark:bg-inherit mt-8">
    <template #top>
      <div class="mb-8 flex justify-between gap-2">
        <div v-if="footer?.links">
          <UButton
            v-for="(link, index) of footer?.links"
            :key="index"
            v-bind="{ color: 'gray', variant: 'ghost', ...link }" />
        </div>

        <UButton
          size="xs"
          label="Settings"
          to="/settings"
          color="gray"
          variant="link" />
      </div>
      <UFooterColumns
        v-if="links.length"
        :links="links"
        class="mb-12"
        :ui="{ label: 'text-base', base: 'text-xs', list: 'mt-4 space-y-2' }">
        <template #top>
          <UFormGroup
            name="email"
            label="Subscribe to our newsletter"
            size="lg">
            <UInput type="email" :ui="{ icon: { trailing: { pointer: '' } } }">
              <template #trailing>
                <UButton
                  type="submit"
                  size="2xs"
                  color="black"
                  label="Subscribe" />
              </template>
            </UInput>
          </UFormGroup>
        </template>
      </UFooterColumns>
      <div>
        <p class="mb-2 text-sm">{{ footer.credits }}. All rights reserved.</p>
        <div class="text-xs text-[#728DA5] flex flex-col gap-3">
          <p>
            This website is hosted by the M^0 Foundation. The information
            contained herein is provided solely for informational purposes and
            the reader should not construe anything contained herein to be a
            solicitation or an offer of sale of securities. Nor should you
            construe the contents of this document as legal, tax or financial
            advice. Any potential participant in the M^0 ecosystem is urged to
            consult their own advisors for any legal, tax or financial
            questions.
          </p>
          <p>
            Neither the $M token, nor any governance tokens associated with the
            M^0 project, will be offered to US persons (without a valid
            exemption). Any token described in this document has not been
            registered or qualified under any state or national securities law
            or regulation.
          </p>
          <p>
            Participation in the purchase, use, or investment in any digital
            assets, tokens, or cryptocurrencies involves inherent risks,
            including but not limited to market volatility, regulatory changes,
            and technological risks. Prospective users should conduct their own
            research and seek the advice of a qualified financial advisor or
            legal counsel before making any decisions. The M^0 Foundation makes
            no representations, warranties or guarantees regarding the accuracy,
            completeness, or reliability of the information contained on this
            website or any linked materials. The M^0 Foundation disclaims any
            liability for any direct, indirect, or consequential losses or
            damages arising from reliance on this information or any errors or
            omissions in its content.By accessing, reading, or using this
            website, you acknowledge and agree to the terms outlined in this
            disclaimer and the Terms and Conditions. You are solely responsible
            for evaluating the risks and merits associated with any actions you
            take related to the contents of this document.
          </p>
        </div>
      </div>
    </template>
  </UFooter>
</template>
